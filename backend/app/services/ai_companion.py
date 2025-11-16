# --- Imports
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore

# --- Paths
# Set this to the directory that CONTAINS your PDFs.
DATA_PATH = "/Users/manav/Desktop/HackathonSDSU/backend/app/data"  # change to /backend/data if that's where the PDFs are
p = Path(DATA_PATH)

print("Directory exists:", p.exists())
print("PDFs in folder:", list(p.glob("*.pdf")))
print("All files:", [f.name for f in p.iterdir()])

# --- Load PDFs
def load_documents():
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    return document_loader.load()

documents = load_documents()

# --- Split into chunks
def split_documents(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

documents = load_documents()
chunks = split_documents(documents)

# --- Embeddings (local, free)
def get_embeddings():
    return HuggingFaceEmbeddings(model_name="intfloat/e5-base-v2")

# --- Supabase client
load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_TABLE_NAME = "banking_handbook"
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Sanitization helpers (avoid control chars like \u0000)
_CTRL_CHARS = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F]")

def clean_text(s: str) -> str:
    if not isinstance(s, str):
        s = str(s)
    s = s.replace("\u0000", "").replace("\x00", "")
    return _CTRL_CHARS.sub(" ", s)

def clean_meta(m: dict) -> dict:
    out = {}
    for k, v in (m or {}).items():
        out[k] = clean_text(v) if isinstance(v, str) else v
    return out

def sanitize_chunks(chunks: list[Document]) -> list[Document]:
    return [
        Document(page_content=clean_text(d.page_content), metadata=clean_meta(d.metadata))
        for d in chunks
    ]

# --- Index into Supabase (vector store)
def add_to_supabase(chunks: list[Document], ids: list[str] | None = None):
    vector_store = SupabaseVectorStore(
        client=supabase_client,
        table_name=SUPABASE_TABLE_NAME,
        embedding=get_embeddings(),
    )
    vector_store.add_documents(chunks, ids=ids)
    print(f"✅ Added {len(chunks)} chunks to '{SUPABASE_TABLE_NAME}'")

sanitized_chunks = sanitize_chunks(chunks)
add_to_supabase(sanitized_chunks)

# --- Retrieval via RPC + prompt building
PROMPT_TEMPLATE = """
You are an SDSU AI companion designed to assist students in registered student organizations
by providing accurate and helpful information based on the SDSU Banking Handbook.
Answer ONLY using the context. If the answer cannot be found in the context, say you don't know.

Context:
{context}

Question:
{question}

Answer:
""".strip()

def query_supabase_rpc(query_text: str, k: int = 5):
    # Embed the query (768-dim for e5-base-v2)
    emb = get_embeddings().embed_query(query_text)

    # Call pgvector RPC defined in your database (match_banking_handbook)
    resp = supabase_client.rpc(
        "match_banking_handbook",
        {"query_embedding": emb, "match_count": k}
    ).execute()

    rows = resp.data or []
    docs = [
        Document(page_content=r["content"], metadata=(r.get("metadata") or {}))
        for r in rows
    ]

    # Build the context block
    parts = []
    for d in docs:
        src = d.metadata.get("source", "unknown")
        pg  = d.metadata.get("page", "–")
        parts.append(f"[source: {src} | page: {pg}]\n{d.page_content}")
    context_text = "\n\n---\n\n".join(parts)

    # Render prompt (you’ll still need an LLM to answer)
    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE).format(
        context=context_text, question=query_text
    )
    return prompt, docs

# --- Example query
q = "recognition requirements for student organizations; Starting the Student Organization Recognition Process; prerequisites; training; forms"
prompt, results = query_supabase_rpc(q, k=3)
print(prompt)