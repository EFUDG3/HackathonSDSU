from fastapi import APIRouter, HTTPException

# this will allow us to schedule the functions here on a separate thread
from starlette.concurrency import run_in_threadpool
from app.schemas.clubs import ClubsCreate, ClubsResponse
from app.crud.clubs import clubs_crud

router = APIRouter(prefix='/clubs', tags=['clubs'])

@router.get("/", response_model=list[ClubsResponse])
async def get_all_clubs():
    data = await run_in_threadpool(clubs_crud.get_all)
    return data

@router.get("/{clubs_id}", response_model=ClubsResponse)
async def get_club_by_id(clubs_id: int):
    club = await run_in_threadpool(clubs_crud.get, clubs_id)

    if club is None:
        raise HTTPException(status_code=404, detail="Club not found")
    return club

@router.post("/", response_model=ClubsResponse)
async def create_club(new_club: ClubsCreate):
    created_club = await run_in_threadpool(clubs_crud.create, new_club.model_dump())

    if created_club is None:
        raise HTTPException(status_code=500, detail="Failed to create club")
    return created_club


