from app.crud.crud_base import CRUDBase
from app.db import supabase

financials_crud = CRUDBase("financial_summaries", supabase)
