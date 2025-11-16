from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import date
from decimal import Decimal
from uuid import UUID

'''
How to structure this:

BASE: Include all fields shared among all models
CREATE: COntains all field client must provide to create a record
UPDATE: ALl fields optional
RESPONSE: What the API returns: Base + id + any server generated fields

'''

Money = condecimal(max_digits=12, decimal_places=2) # reusable type


class FinancialsBase(BaseModel):
    period_start: date
    period_end: date
    current_balance: Money
    
    revenue_donations: Money
    revenue_fundraising: Money
    revenue_sponsorship: Money
    
    expense_food: Money
    expense_giveaway: Money
    expense_uniforms: Money

class FinancialsCreate(FinancialsBase):
    club_id: int # BIGINT

class FinancialsUpdate(BaseModel):
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    current_balance: Optional[Money] = None

    revenue_donations: Optional[Money] = None
    revenue_fundraising: Optional[Money] = None
    revenue_sponsorship: Optional[Money] = None

    expense_food: Optional[Money] = None
    expense_giveaway: Optional[Money] = None
    expense_uniforms: Optional[Money] = None

    club_id: Optional[int] = None  # only if updates allow changing club linkage

# all of these are optional
class FinancialsResponse(FinancialsBase):
    id: UUID
    club_id: int
    revenue_total: Money
    expenses_total: Money