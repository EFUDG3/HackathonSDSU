from typing import List, Tuple
from supabase import create_client
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

from ai.embeddings import embed_query, get_embeddings
from ai.settings import SUPABASE_URL, SUPABASE_KEY, RPC_NAME

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

def _client():
    if not (SUPABASE_URL and SUPABASE_KEY):
        raise RuntimeError("Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def retrieve_context(query_text: str, k: int =8, threshold: float = 0.0):
    emb = embed_query(query_text)

    rows = _client().rpc(RPC_NAME, {"query_embedding": emb, "match_count": k}).execute().data or []
    docs = [Document(page_content=r.get("content", ""), metadata=(r.get("metadata") or {})) for r in rows]

    parts = []
    for d in docs:
        src = d.metadata.get("source", "unknown")
        pg  = d.metadata.get("page", "–")
        parts.append(f"[source: {src} | page: {pg}]\n{d.page_content}")
    context_text = "\n\n---\n\n".join(parts) if parts else "No matching context found."

    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE).format(context=context_text, question=query_text)
    print(docs)
    return prompt, docs
