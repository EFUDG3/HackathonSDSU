import json
import requests

# Your FastAPI server URL
API_URL = "http://localhost:8000/financials/"

# Simple mapping: PDF code -> Schema field name
CODE_MAP = {
    # Revenue codes
    "3300": "revenue_donations",
    "3311": "revenue_fundraising",
    "3325": "revenue_sponsorship",
    
    # Expense codes
    "5520": "expense_food",
    "6413": "expense_giveaway",
    "5751": "expense_uniforms",
}

def clean_value(value_string):
    """
    Turn '8,875.54' or '-' into a clean number string like '8875.54' or '0.00'
    """
    # If it's empty or just a dash, return zero
    if not value_string or value_string.strip() == "-":
        return "0.00"
    
    # Remove commas and dollar signs
    clean = value_string.replace(",", "").replace("$", "").strip()
    
    return clean

def create_record_for_period(period_data, club_id):
    """
    Take data for ONE period and create a record that matches your schema.
    
    period_data looks like:
    {
        "period_info": {"start": "2024-07-01", "end": "2025-06-30"},
        "data": {
            "Revenue": [...items...],
            "Expenditures": [...items...]
        }
    }
    """
    
    # Start with a blank record - all zeros
    record = {
        "club_id": club_id,
        "period_start": period_data['period_info']['start'],
        "period_end": period_data['period_info']['end'],
        "current_balance": "0.00",
        "revenue_donations": "0.00",
        "revenue_fundraising": "0.00",
        "revenue_sponsorship": "0.00",
        "expense_food": "0.00",
        "expense_giveaway": "0.00",
        "expense_uniforms": "0.00",
    }
    
    # Fill in Revenue values
    for item in period_data['data']['Revenue']:
        code = item['code']
        value = clean_value(item['value'])
        
        # Special case: cash balance forward
        if code == "3981":
            record["current_balance"] = value
        
        # If this code is in our map, save its value
        if code in CODE_MAP:
            field_name = CODE_MAP[code]
            record[field_name] = value
    
    # Fill in Expense values
    for item in period_data['data']['Expenditures']:
        code = item['code']
        value = clean_value(item['value'])
        
        # If this code is in our map, save its value
        if code in CODE_MAP:
            field_name = CODE_MAP[code]
            record[field_name] = value
    
    return record

def upload_to_api(json_file, club_id):
    """
    Read the JSON file and upload both periods to your FastAPI.
    """
    
    # Load the JSON file
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    print(f"\nUploading financial data for club {club_id}...")
    print("=" * 60)
    
    # Process Period 1
    print("\nCreating Period 1...")
    period_1_record = create_record_for_period(data['period_1'], club_id)
    
    response = requests.post(API_URL, json=period_1_record)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success! Record ID: {result['id']}")
        print(f"Period: {result['period_start']} to {result['period_end']}")
        print(f"Balance: ${result['current_balance']}")
        print(f"Total Revenue: ${result['revenue_total']}")
        print(f"Total Expenses: ${result['expenses_total']}")
    else:
        print(f"Failed: {response.status_code}")
        print(f"Error: {response.text}")
    
    # Process Period 2
    print("\nCreating Period 2...")
    period_2_record = create_record_for_period(data['period_2'], club_id)
    
    response = requests.post(API_URL, json=period_2_record)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success! Record ID: {result['id']}")
        print(f"Period: {result['period_start']} to {result['period_end']}")
        print(f"Balance: ${result['current_balance']}")
        print(f"Total Revenue: ${result['revenue_total']}")
        print(f"Total Expenses: ${result['expenses_total']}")
    else:
        print(f"Failed: {response.status_code}")
        print(f"Error: {response.text}")
    
    print("\n✨ Done!")

# Run it!
if __name__ == "__main__":
    print("Financial Data Uploader")
    print("=" * 60)
    
    # Ask for inputs
    json_file = input("Enter JSON file path (press Enter for 'financial_summary_split.json'): ").strip()
    if not json_file:
        json_file = "financial_summary_split.json"
    
    club_id = input("Enter club ID (number): ").strip()
    club_id = int(club_id)
    
    # Do the upload
    upload_to_api(json_file, club_id)