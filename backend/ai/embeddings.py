from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings
from ai.settings import EMBED_MODEL

@lru_cache(maxsize=1)
def get_embeddings():
    # normalize_embeddings=True is important for cosine search
    return HuggingFaceEmbeddings(
        model_name=EMBED_MODEL, 
        encode_kwargs={"normalize_embeddings": True}
    )

def embed_query(text: str) -> list[float]:
    return get_embeddings().embed_query("query: " + text)

def embed_documents(texts: list[str]) -> list[list[float]]:
    # used only if you manually embed docs; VectorStore will call embed_documents internally
    return get_embeddings().embed_documents(["passage: " + t for t in texts])
