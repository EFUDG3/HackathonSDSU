from app.crud.crud_base import CRUDBase
from app.db import supabase

clubs_crud = CRUDBase("clubs", supabase)