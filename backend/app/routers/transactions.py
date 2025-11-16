from fastapi import APIRouter, HTTPException
from typing import List
from db import get_supabase
from models import TransactionsBase, TransactionsResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/club/{club_id}", response_model=List[TransactionsResponse])
async def get_club_transactions(club_id: str, limit: int = 50):
    supabase = get_supabase()
    response = supabase.table("transactions")\
        .select("*")\
        .eq("club_id", club_id)\
        .order("date", desc=True)\
        .limit(limit)\
        .execute()
    
    return response.data

@router.post("/club/{club_id}", response_model=TransactionsResponse)
async def create_transaction(club_id: str, transaction: TransactionsBase):
    supabase = get_supabase()
    
    # Insert transaction
    transaction_data = transaction.model_dump()
    transaction_data["club_id"] = club_id
    
    response = supabase.table("transactions").insert(transaction_data).execute()
    
    # Update club budget
    supabase.rpc("update_club_budget", {
        "club_id": club_id,
        "amount": float(transaction.amount)
    }).execute()
    
    return response.data[0]

# @router.get("/stats/{club_id}")
# async def get_transaction_stats(club_id: str):
#     supabase = get_supabase()
    
#     # Get all transactions for the club
#     response = supabase.table("transactions")\
#         .select("amount, type, category, date")\
#         .eq("club_id", club_id)\
#         .execute()
    
#     transactions = response.data
    
#     # Calculate stats
#     total_expenses = sum(float(t["amount"]) for t in transactions if t["type"] == "expense")
#     total_income = sum(float(t["amount"]) for t in transactions if t["type"] == "income")
    
#     # Group by category
#     by_category = {}
#     for t in transactions:
#         cat = t.get("category", "other")
#         by_category[cat] = by_category.get(cat, 0) + abs(float(t["amount"]))
    
#     return {
#         "total_expenses": total_expenses,
#         "total_income": total_income,
#         "by_category": by_category,
#         "transaction_count": len(transactions)
#     }