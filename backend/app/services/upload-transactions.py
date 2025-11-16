import csv
import requests
from datetime import datetime
from decimal import Decimal

# Your FastAPI server URLs
TRANSACTIONS_API_URL = "http://localhost:8000/transactions/"
FINANCIALS_API_URL = "http://localhost:8000/financials/"

# Code mapping: Transaction code -> Financial field name
CODE_TO_FINANCIAL_FIELD = {
    # Revenue codes
    "3300": "revenue_donations",
    "3311": "revenue_fundraising",
    "3325": "revenue_sponsorship",
    
    # Expense codes
    "5520": "expense_food",
    "6413": "expense_giveaway",
    "5751": "expense_uniforms",
}


def parse_date(date_str):
    """
    Parse date from CSV format (MM/DD/YY) to ISO format (YYYY-MM-DD).
    """
    try:
        # Handle MM/DD/YY format
        dt = datetime.strptime(date_str, "%m/%d/%y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        try:
            # Handle YYYY-MM-DD format (if already ISO)
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            return date_str
        except ValueError:
            print(f"⚠️  Warning: Could not parse date '{date_str}', using today's date")
            return datetime.now().strftime("%Y-%m-%d")


def get_financial_record_for_date(club_id, transaction_date):
    """
    Find the financial record that contains this transaction date.
    Returns the record if found, None otherwise.
    """
    try:
        # Get all financials for this club
        response = requests.get(f"{FINANCIALS_API_URL}all/{club_id}")
        
        if response.status_code != 200:
            print(f"  ⚠️  Could not fetch financials: {response.status_code}")
            return None
        
        records = response.json()
        
        # Find the period that contains this date
        trans_date = datetime.strptime(transaction_date, "%Y-%m-%d").date()
        
        for record in records:
            period_start = datetime.strptime(record['period_start'], "%Y-%m-%d").date()
            period_end = datetime.strptime(record['period_end'], "%Y-%m-%d").date()
            
            if period_start <= trans_date <= period_end:
                return record
        
        print(f"  ⚠️  No financial period found for date {transaction_date}")
        return None
    except Exception as e:
        print(f"  ✗ Error fetching financial record: {e}")
        return None


def update_financial_with_transaction(financial_record, code, amount):
    """
    Update the financial record by adding the transaction amount to the correct field.
    Uses the transaction code to determine which field to update.
    """
    # Map code to field name
    field_name = CODE_TO_FINANCIAL_FIELD.get(code)
    
    if not field_name:
        print(f"  ⚠️  No financial field mapping for code '{code}'")
        return False
    
    # Get current value from the record
    current_value = float(financial_record[field_name])
    new_value = current_value + float(amount)
    
    # Update the field
    update_data = {
        field_name: f"{new_value:.2f}"
    }
    
    # Use the UUID from the financial record
    financial_id = financial_record['id']
    # Make sure we're hitting the PATCH endpoint with the UUID
    patch_url = f"{FINANCIALS_API_URL.rstrip('/')}/{financial_id}"
    response = requests.patch(patch_url, json=update_data)
    
    if response.status_code == 200:
        print(f"  → Updated {field_name}: ${current_value:.2f} → ${new_value:.2f}")
        return True
    else:
        print(f"  ✗ Failed to update financials: {response.status_code}")
        print(f"    Response: {response.text}")
        return False


def create_transaction_from_row(row):
    """
    Convert a CSV row to a transaction dict for the API.
    Skips the 'id' and 'created_at' fields as those are auto-generated.
    """
    # Parse the date
    parsed_date = parse_date(row['date'])
    
    # Handle N/A values
    vendor = None if row['vendor'].upper() == "N/A" else row['vendor']
    receipt_url = None if row['receipt_url'].upper() == "N/A" else row['receipt_url']
    
    transaction = {
        "club_id": int(row['club_id']),
        "amount": row['amount'],
        "code": row['code'],
        "category": row['category'],
        "description": row['description'],
        "date": parsed_date,
        "status": row['status'].lower(),
        "vendor": vendor,
        "receipt_url": receipt_url,
    }
    
    return transaction


def upload_csv(csv_file):
    """
    Read a CSV file and upload all transactions.
    Automatically updates the corresponding financial records based on transaction codes.
    """
    print(f"\nUploading transactions from: {csv_file}")
    print("=" * 70)
    
    transaction_count = 0
    updated_financials = set()  # Track which financial records we've updated
    skipped_count = 0
    failed_count = 0
    
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        
        for i, row in enumerate(reader, start=1):
            print(f"\n[{i}] Processing: {row['description']}")
            print(f"    Code: {row['code']} | Amount: ${row['amount']} | Status: {row['status']}")
            
            # Create transaction data (without id and created_at)
            transaction = create_transaction_from_row(row)
            
            # Create the transaction via API
            response = requests.post(TRANSACTIONS_API_URL, json=transaction)
            
            if response.status_code == 200:
                result = response.json()
                transaction_count += 1
                print(f"  ✓ Transaction created successfully")
                
                # Only update financials if status is completed or approved
                if transaction['status'] in ['completed', 'approved']:
                    # Check if this code maps to a financial field
                    if transaction['code'] not in CODE_TO_FINANCIAL_FIELD:
                        print(f"  ⓘ  Code {transaction['code']} not in mapping - skipping financial update")
                        skipped_count += 1
                        continue
                    
                    # Find the financial record for this transaction date
                    financial_record = get_financial_record_for_date(
                        transaction['club_id'],
                        transaction['date']
                    )
                    
                    if financial_record:
                        # Update the financial record using the code
                        success = update_financial_with_transaction(
                            financial_record,
                            transaction['code'],
                            transaction['amount']
                        )
                        
                        if success:
                            updated_financials.add(financial_record['id'])
                        else:
                            failed_count += 1
                    else:
                        print(f"  ⚠️  No financial record found for date {transaction['date']}")
                        skipped_count += 1
                else:
                    print(f"  ⓘ  Skipping financial update (status: {transaction['status']})")
                    skipped_count += 1
                    
            else:
                print(f"  ✗ Failed to create transaction: {response.status_code}")
                print(f"    Error: {response.text}")
                failed_count += 1
    
    print("\n" + "=" * 70)
    print(f"✨ Upload complete!")
    print(f"   ✓ {transaction_count} transactions created")
    print(f"   ✓ {len(updated_financials)} financial records updated")
    if skipped_count > 0:
        print(f"   ⓘ {skipped_count} transactions skipped (pending/rejected or no mapping)")
    if failed_count > 0:
        print(f"   ✗ {failed_count} transactions failed")


# Run it!
if __name__ == "__main__":
    print("Transaction CSV Uploader")
    print("=" * 70)
    print("This script:")
    print("  1. Reads transactions from a CSV file")
    print("  2. Creates transaction records in the database")
    print("  3. Uses transaction CODES to update financial fields")
    print("  4. Finds the correct financial period based on transaction date")
    print()
    print("Code Mappings:")
    for code, field in CODE_TO_FINANCIAL_FIELD.items():
        print(f"  {code} → {field}")
    print()
    print("Note: Only transactions with status 'completed' or 'approved'")
    print("      will update the financial totals.")
    print()
    
    # Ask for input
    csv_file = input("Enter CSV file path: ").strip()
    
    if not csv_file:
        print("❌ No file path provided!")
        exit(1)
    
    # Do the upload
    upload_csv(csv_file)