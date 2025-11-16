from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal # good for financial calculations


# these pydantic models define the data that the API endpoints return as response
# this will ensures data validation and serialization (JSON)

class ClubBase(BaseModel): # this represents what USERS SEND
    name: str
    email: str
    description: Optional[str] = None
    club_type: str
    link: Optional[str] = None

class ClubResponse(BaseModel): # this represents what the API returns
    id: int
    name: str
    current_budget: Decimal

class TransactionsBase(BaseModel):
    club_id: int
    amount: Decimal
    transaction_type: str  # 'income' or 'expense'
    date: date
    description: Optional[str] = None

class TransactionsResponse(TransactionsBase):
    id: str
    club_id: int
    amount: Decimal
    status: str
    vendor: str


class HelpfulLinks(BaseModel):
    title: str
    url: str
    description: str

class HelpfulLinksResponse(HelpfulLinks):
    id: str
    club_id: str
    title: str
    url: str
    description: str








