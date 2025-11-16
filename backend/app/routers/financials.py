from fastapi import APIRouter, HTTPException
from datetime import date, timedelta
from decimal import Decimal
from db import get_supabase

router = APIRouter(prefix='/financials', tags=['financials'])

@router.get("/club/{club_id}/summary")
async def get_club_summary(club_id: str):
    """
    Get financial summary for a club within a date range.
    Defaults to current month if no dates provided.
    """

    supabase = get_supabase()
    
    # Get all transactions in the date range
    response = supabase.table("transactions")\
        .select("*")\
        .eq("club_id", club_id)\
        .execute()
    
    transactions = response.data
    
    # # Initialize counters
    # summary = {
    #     "revenue_donations": Decimal("0.00"),
    #     "revenue_fundraising": Decimal("0.00"),
    #     "revenue_sponsorship": Decimal("0.00"),
    #     "expense_food": Decimal("0.00"),
    #     "expense_giveaway": Decimal("0.00"),
    #     "expense_uniforms": Decimal("0.00"),
    # }
    
    # # Aggregate transactions
    # for t in transactions:
    #     amount = Decimal(str(t["amount"]))
    #     subcategory = t.get("subcategory", "")
        
    #     if t["type"] == "income":
    #         if subcategory == "donations":
    #             summary["revenue_donations"] += amount
    #         elif subcategory == "fundraising":
    #             summary["revenue_fundraising"] += amount
    #         elif subcategory == "sponsorship":
    #             summary["revenue_sponsorship"] += amount
        
    #     elif t["type"] == "expense":
    #         abs_amount = abs(amount)
    #         if subcategory == "food":
    #             summary["expense_food"] += abs_amount
    #         elif subcategory == "travel":
    #             summary["expense_travel"] += abs_amount
    #         elif subcategory == "uniforms":
    #             summary["expense_uniforms"] += abs_amount
    
    # Calculate totals
    # total_revenue = (
    #     summary["revenue_donations"] + 
    #     summary["revenue_fundraising"] + 
    #     summary["revenue_sponsorship"]
    # )
    
    # total_expenses = (
    #     summary["expense_food"] + 
    #     summary["expense_travel"] + 
    #     summary["expense_uniforms"]
    # )
    
    # net_change = total_revenue - total_expenses
    
    # # Get current balance from clubs table
    # club_response = supabase.table("clubs")\
    #     .select("current_budget")\
    #     .eq("id", club_id)\
    #     .execute()
    
    # if not club_response.data:
    #     raise HTTPException(status_code=404, detail="Club not found")
    
    # current_balance = Decimal(str(club_response.data[0]["current_budget"]))
    
    # return FinancialSummary(
    #     period_start=start_date,
    #     period_end=end_date,
    #     revenue_donations=summary["revenue_donations"],
    #     revenue_fundraising=summary["revenue_fundraising"],
    #     revenue_sponsorship=summary["revenue_sponsorship"],
    #     total_revenue=total_revenue,
    #     expense_food=summary["expense_food"],
    #     expense_travel=summary["expense_travel"],
    #     expense_uniforms=summary["expense_uniforms"],
    #     total_expenses=total_expenses,
    #     net_change=net_change,
    #     current_balance=current_balance
    # )



