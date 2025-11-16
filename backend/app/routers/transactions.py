from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool
from app.schemas.transactions import TransactionsCreate, TransactionsResponse, TransactionsUpdate
from app.crud.transactions import transactions_crud

router = APIRouter(prefix="/transactions", tags=["transactions"])

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
    Create a new transaction.
    """
    created = await run_in_threadpool(transactions_crud.create, new_transaction.model_dump())

    if created is None:
        raise HTTPException(status_code=500, detail="Failed to create transaction")

    return created


@router.patch("/{transaction_id}", response_model=TransactionsResponse)
async def update_transaction(transaction_id: int, updates: TransactionsUpdate):
    """
    Update fields of an existing transaction.
    """
    updated = await run_in_threadpool(
        transactions_crud.update,
        transaction_id,
        updates.model_dump(exclude_unset=True)
    )

    if updated is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return updated


# not sure if we would have to reflect the actual budget
@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: int):
    """
    Delete a transaction by its ID.
    """
    deleted = await run_in_threadpool(transactions_crud.delete, transaction_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found or could not be deleted")

    return {"message": "Transaction deleted successfully"}