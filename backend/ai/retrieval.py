from typing import List, Tuple
from supabase import create_client
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate

from ai.embeddings import embed_query, get_embeddings
from ai.settings import SUPABASE_URL, SUPABASE_KEY, RPC_NAME

PROMPT_TEMPLATE = """
You are the SDSU Registered Student Organization (RSO) Assistant.

Your purpose:
Provide clear, accurate, and kind answers to questions about RSOs, including finance,
recognition, training, events, and policies, using ONLY the context provided below.

Rules:
1. Use the supplied context exclusively. Do not invent or guess information.
2. If the answer cannot be found in the context, say "I don't know."
3. Keep the answer concise, clear, and welcoming in tone.
4. When relevant, include brief "Sources:" lines that mention document titles,
   page numbers, or URLs from the context.

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
