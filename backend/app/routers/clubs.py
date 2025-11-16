from fastapi import APIRouter, HTTPException
from typing import List
from db import get_supabase
from models import ClubResponse

router = APIRouter(prefix='/clubs', tags=['clubs'])

@router.get("/", response_model=List[ClubResponse]) # this would be a list of clubs
async def get_all_clubs():
    supabase = get_supabase()
    response = supabase.table("clubs").select("*").execute()
    
    return response.data

@router.get("/{club_id}", response_model=ClubResponse) # this would be for a specific club
async def get_club(club_id: str):
    supabase = get_supabase()
    response = supabase.table("clubs").select("*").eq("id", club_id).execute()
    
    # handle if this club doesn't exist
    if not response.data:
        raise HTTPException(status_code=404, detail="Club not found")
    
    return response.data[0]


