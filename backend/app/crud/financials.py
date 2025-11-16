from app.crud.crud_base import CRUDBase, make_json_safe, GENERATED_COLUMNS
from app.db import supabase

class FinancialsCRUD(CRUDBase):
    """
    Custom CRUD for financials that handles UUID primary keys properly.
    """
    
    def update_by_uuid(self, uuid_str: str, data: dict):
        """
        Update a financial record by UUID string.
        Handles the UUID type properly for Supabase.
        """
        # Remove read-only columns if present
        clean = {k: v for k, v in data.items() if k not in GENERATED_COLUMNS}
        
        json_safe_data = make_json_safe(clean)
        
        # Use the UUID string directly
        resp = self.table.update(json_safe_data).eq("id", uuid_str).execute()
        return resp.data[0] if resp.data else None


financials_crud = FinancialsCRUD("financial_summaries", supabase)