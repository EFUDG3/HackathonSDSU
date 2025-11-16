from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ClubsBase(BaseModel):
    name: str
    email: str
    description: Optional[str] = None
    status: Optional[str] = None
    club_type: str
    link: Optional[str] = None

class ClubsCreate(ClubsBase):
    name: str
    email: str
    club_type: str

class ClubsResponse(ClubsBase):
    id: int

# all of these are optional
class ClubsUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    club_type: Optional[str] = None
    link: Optional[str] = None




