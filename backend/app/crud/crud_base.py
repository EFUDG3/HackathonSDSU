# app/crud/crud_base.py
from datetime import date, datetime
from decimal import Decimal

def make_json_safe(data: dict):
    safe = {}
    for key, value in data.items():
        if isinstance(value, (date, datetime)):
            safe[key] = value.isoformat()  # convert to "YYYY-MM-DD"
        elif isinstance(value, Decimal):
            safe[key] = str(value)       # or: str(value)
        else:
            safe[key] = value
    return safe

GENERATED_COLUMNS = {
    "revenue_total",
    "expenses_total",
}


class CRUDBase:
    def __init__(self, table_name: str, client):
        self.table = client.table(table_name)

    # synchronous methods (no async / await) -> will keep async endpoints however
    def get_all(self):
        resp = self.table.select("*").execute()
        return resp.data

    def get(self, id: int):
        resp = self.table.select("*").eq("id", id).single().execute()
        return resp.data
    
    def get_by(self, column: str, value):
        resp = self.table.select("*").eq(column, value).single().execute()
        return resp.data
    
    # allows us to get all summaries for a given club
    def list_by(self, column: str, value):
        resp = self.table.select("*").eq(column, value).execute()
        return resp.data

    # maybe add potential route for retrieving the latest summary for a club

    def create(self, data: dict):
        # Remove read-only columns if present
        clean = {k: v for k, v in data.items() if k not in GENERATED_COLUMNS}

        json_safe_data = make_json_safe(clean)
        resp = self.table.insert(json_safe_data).execute()
        return resp.data[0] if resp.data else None

    def update(self, id: int, data: dict):
        clean = {k: v for k, v in data.items() if k not in GENERATED_COLUMNS}

        json_safe_data = make_json_safe(clean)
        resp = self.table.update(json_safe_data).eq("id", id).execute()
        return resp.data

    def delete(self, id: int):
        resp = self.table.delete().eq("id", id).execute()
        return resp.data