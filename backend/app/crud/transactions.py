from app.crud.crud_base import CRUDBase
from app.db import supabase

transactions_crud = CRUDBase("transactions", supabase)