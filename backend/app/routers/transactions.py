from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool
from app.schemas.transactions import TransactionsCreate, TransactionsResponse, TransactionsUpdate
from app.crud.transactions import transactions_crud
from app.crud.financials import financials_crud
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["transactions"])

# Code mapping: Transaction code -> Financial field name
CODE_TO_FINANCIAL_FIELD = {
    "3300": "revenue_donations",
    "3311": "revenue_fundraising",
    "3325": "revenue_sponsorship",
    "5520": "expense_food",
    "6413": "expense_giveaway",
    "5751": "expense_uniforms",
}


def find_financial_record_for_date(club_id: int, transaction_date):
    """
    Find the financial record that contains this transaction date.
    Returns the record if found, None otherwise.
    """
    try:
        # Get all financials for this club
        summaries = financials_crud.list_by("club_id", club_id)
        
        if not summaries:
            return None
        
        # Convert transaction_date to date object if it's a string
        if isinstance(transaction_date, str):
            trans_date = datetime.strptime(transaction_date, "%Y-%m-%d").date()
        else:
            trans_date = transaction_date
        
        # Find the period that contains this date
        for record in summaries:
            period_start = record['period_start']
            period_end = record['period_end']
            
            # Convert to date objects if they're strings
            if isinstance(period_start, str):
                period_start = datetime.strptime(period_start, "%Y-%m-%d").date()
            if isinstance(period_end, str):
                period_end = datetime.strptime(period_end, "%Y-%m-%d").date()
            
            if period_start <= trans_date <= period_end:
                return record
        
        return None
    except Exception as e:
        print(f"Error finding financial record: {e}")
        return None


def update_financial_with_transaction_sync(financial_record, code: str, amount: str):
    """
    Update the financial record by adding the transaction amount to the correct field.
    Uses the transaction code to determine which field to update.
    Synchronous version for use in the router.
    """
    # Map code to field name
    field_name = CODE_TO_FINANCIAL_FIELD.get(code)
    
    if not field_name:
        print(f"Warning: No financial field mapping for code '{code}'")
        return False
    
    # Get current value from the record
    current_value = float(financial_record[field_name])
    new_value = current_value + float(amount)
    
    # Update the field
    update_data = {
        field_name: f"{new_value:.2f}"
    }
    
    try:
        financial_id = financial_record['id']
        updated = financials_crud.update_by_uuid(financial_id, update_data)
        return updated is not None
    except Exception as e:
        print(f"Error updating financial record: {e}")
        return False


@router.get("/club/{club_id}", response_model=list[TransactionsResponse])
async def get_transactions_for_club(club_id: int):
    """
    Get all transactions belonging to a specific club.
    """
    transactions = await run_in_threadpool(transactions_crud.list_by, "club_id", club_id)

    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this club")

    return transactions


@router.get("/{transaction_id}", response_model=TransactionsResponse)
async def get_transaction(transaction_id: str):
    """
    Retrieve a single transaction by its ID.
    """
    transaction = await run_in_threadpool(transactions_crud.get_by, "id", transaction_id)

    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


@router.post("/", response_model=TransactionsResponse)
async def create_transaction(new_transaction: TransactionsCreate):
    """
    Create a new transaction and automatically update the corresponding financial record.
    Only updates financials if:
    - Status is 'completed' or 'approved'
    - Transaction code maps to a financial field
    - A matching financial period exists
    """
    # Create the transaction
    created = await run_in_threadpool(transactions_crud.create, new_transaction.model_dump())

    if created is None:
        raise HTTPException(status_code=500, detail="Failed to create transaction")

    # Auto-update financials if conditions are met
    if created['status'] in ['completed', 'approved']:
        # Check if this code maps to a financial field
        if created.get('code') and created['code'] in CODE_TO_FINANCIAL_FIELD:
            # Find the financial record for this transaction's date
            financial_record = await run_in_threadpool(
                find_financial_record_for_date,
                created['club_id'],
                created['date']
            )
            
            if financial_record:
                # Update the financial record
                success = await run_in_threadpool(
                    update_financial_with_transaction_sync,
                    financial_record,
                    created['code'],
                    str(created['amount'])
                )
                
                if not success:
                    print(f"Warning: Failed to update financial record for transaction {created['id']}")
            else:
                print(f"Warning: No financial record found for date {created['date']}")

    return created


@router.patch("/{transaction_id}", response_model=TransactionsResponse)
async def update_transaction(transaction_id: str, updates: TransactionsUpdate):
    """
    Update fields of an existing transaction.
    Note: This does NOT automatically update financials. Use with caution.
    """
    updated = await run_in_threadpool(
        transactions_crud.update,
        transaction_id,
        updates.model_dump(exclude_unset=True)
    )

    if updated is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return updated


@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str):
    """
    Delete a transaction by its ID.
    Note: This does NOT automatically update financials. You may need to manually adjust.
    """
    deleted = await run_in_threadpool(transactions_crud.delete, transaction_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found or could not be deleted")

    return {"message": "Transaction deleted successfully"}