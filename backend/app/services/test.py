import requests

# Get a financial record first
response = requests.get("http://localhost:8000/financials/all/1")
record = response.json()[0]
print("Financial record:", record)
print("ID:", record['id'])

# Try to update it
update_data = {"expense_giveaway": "500.00"}
response = requests.patch(f"http://localhost:8000/financials/{record['id']}", json=update_data)
print("Status:", response.status_code)
print("Response:", response.text)