from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clubs, transactions
from app.routers import financials


app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers
app.include_router(clubs.router)
app.include_router(transactions.router)
app.include_router(financials.router)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your application!"}


