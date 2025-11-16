import re
from typing import List
from pathlib import Path
from supabase import create_client
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore

from ai.settings import SUPABASE_URL, SUPABASE_KEY, SUPABASE_TABLE_NAME, DATA_PATH
from ai.embeddings import get_embeddings

_CTRL = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F]")

def _clean_text(s: str) -> str:
    s = (s if isinstance(s, str) else str(s)).replace("\u0000", "").replace("\x00", "")
    return _CTRL.sub(" ", s)

def _clean_meta(m: dict) -> dict:
    return {k: _clean_text(v) if isinstance(v, str) else v for k, v in (m or {}).items()}

def sanitize(chunks):
    from langchain_core.documents import Document
    out = []
    for d in chunks:
        clean = _clean_text(d.page_content)
        # E5 doc-side instruction
        clean = "passage: " + clean
        out.append(Document(page_content=clean, metadata=_clean_meta(d.metadata)))
    return out


def load_documents(data_dir: Path = DATA_PATH) -> List[Document]:
    if not data_dir.exists():
        return []
    return PyPDFDirectoryLoader(str(data_dir)).load()

def split_documents(documents: List[Document]) -> List[Document]:
    if not documents:
        return []
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=80, length_function=len)
    return splitter.split_documents(documents)


# Index PDFs from data_dir into Supabase vector store
def index_pdfs_to_supabase(data_dir: Path = DATA_PATH) -> int:
    docs = load_documents(data_dir)
    chunks = split_documents(docs)
    sanitized = sanitize(chunks)
    if not sanitized:
        print("⚠️ No chunks to index.")
        return 0
    if not (SUPABASE_URL and SUPABASE_KEY):
        print("⚠️ Missing Supabase env vars; skipping index.")
        return 0

    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    store = SupabaseVectorStore(client=client, table_name=SUPABASE_TABLE_NAME, embedding=get_embeddings())
    store.add_documents(sanitized)
    print(f"✅ Added {len(sanitized)} chunks to '{SUPABASE_TABLE_NAME}'")
    return len(sanitized)

if __name__ == "__main__":
    from pathlib import Path
    import sys
    from ai.settings import DATA_PATH

    data_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DATA_PATH
    print("🚀 Starting PDF indexing…", flush=True)
    print("📂 DATA_DIR:", data_dir, flush=True)

    count = index_pdfs_to_supabase(data_dir)
    print(f"🎯 Done. Indexed chunks: {count}", flush=True)
