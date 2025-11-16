from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from app.routers import clubs, transactions, financials
from typing import Dict
import os
from dotenv import load_dotenv

from app.services.ai_companion import query_supabase_rpc

# --- App Initialization and Middleware ---
app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173",
    "*"
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
app.include_router(financials.router)
app.include_router(transactions.router)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your application!"}


# --- Configuration & Model Initialization ---
load_dotenv()  # Load environment variables from .env file

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")

genai.configure(api_key=GOOGLE_API_KEY)

# In-memory store for active chat sessions
chats = {}

MODEL_NAME = "gemini-2.0-flash"

# --- Data Models ---
class ChatInput(BaseModel):
    user_message: str
    session_id: str

# --- API Endpoints ---
@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "model": MODEL_NAME}

@app.post("/chat", tags=["Chat"])
async def chat(chat_input: ChatInput):
    session_id = chat_input.session_id
    user_message = chat_input.user_message

    try:

        # _______ FOR RAG STUFF ______

        relevant_context, _ = query_supabase_rpc(user_message)

        augmented_message = f"""
        Context from knowledge base:
        {relevant_context}
        
        Please answer based on the context and question provided above.
        # """

        if session_id not in chats:
            session = genai.GenerativeModel(MODEL_NAME).start_chat(
                history=[
                    {"role": "user", "parts": [{"text": "You are a helpful club assistant."}]},
                    {"role": "model", "parts": [{"text": "Hi! I'm your club assistant. Ask me about finance policies, action items, or type 'help' for options."}]}
                ]
            )
            chats[session_id] = session
        
        session = chats[session_id]
        response = session.send_message(augmented_message) # send augmented message later for RAG
        
        return {"response": response.text}
    
    except Exception as e:
        print(f"Error processing chat request for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating content: {e}")
    

# @app.get("/list-models", tags=["Test"])
# async def list_models():
#     try:
#         models = genai.list_models()
#         available = [m.name for m in models]
#         return {"models": available}
#     except Exception as e:
#         return {"error": str(e)}
