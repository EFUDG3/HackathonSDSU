from pydantic import BaseModel, condecimal
from typing import List, Optional
from datetime import date, datetime
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


class TransactionsBase(BaseModel):
    club_id: int
    amount: Money
    type: str
    category: Optional[str] = None
    description: Optional[str] = None
    date: date
    status: Optional[str] = None
    vendor: Optional[str] = None
    receipt_url: Optional[str] = None



class TransactionsCreate(TransactionsBase):
    pass

class TransactionsUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    status: Optional[str] = None
    vendor: Optional[str] = None
    receipt_url: Optional[str] = None



# all of these are optional
class TransactionsResponse(TransactionsBase):
    id: UUID
    created_at: datetime
