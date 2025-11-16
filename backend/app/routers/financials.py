from fastapi import APIRouter, HTTPException
# this will allow us to schedule the functions here on a separate thread
from starlette.concurrency import run_in_threadpool
from app.schemas.financials import FinancialsCreate, FinancialsResponse, FinancialsUpdate
from app.crud.financials import financials_crud

router = APIRouter(prefix="/financials", tags=["financials"])

@router.get("/{clubs_id}", response_model=FinancialsResponse)
async def get_club_financial_summary(clubs_id: int):
    finances = await run_in_threadpool(financials_crud.get_by, "club_id", clubs_id)

    if finances is None:
        raise HTTPException(status_code=404, detail="Summary not found")
    return finances

@router.get("/all/{club_id}", response_model=list[FinancialsResponse])
async def get_all_summaries_for_club(club_id: int):
    """
    Return all financial summaries for a given club.
    """
    summaries = await run_in_threadpool(financials_crud.list_by, "club_id", club_id)

    if not summaries:
        # optional, depending on your preference
        raise HTTPException(status_code=404, detail="No financial summaries found for this club")

    return summaries

@router.post("/", response_model=FinancialsResponse)
async def create_financial_summary(new_summary: FinancialsCreate):
    created_summary = await run_in_threadpool(financials_crud.create, new_summary.model_dump())

    if created_summary is None:
        raise HTTPException(status_code=500, detail="Failed to create club")
    return created_summary

@router.patch("/{club_id}", response_model=FinancialsResponse)
async def update_financial_summary(club_id: int, updates: FinancialsUpdate):
    updated = await run_in_threadpool(
        financials_crud.update,
        club_id,
        updates.model_dump(exclude_unset=True)
    )

    if updated is None:
        raise HTTPException(status_code=404, detail="Financial summary not found")

    return updated










