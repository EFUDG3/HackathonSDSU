# app/config.py
from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices

# Resolve .env next to the backend root regardless of CWD
# Assuming your tree is .../backend/.env and this file is .../backend/app/config.py
BACKEND_ROOT = Path(__file__).resolve().parent.parent   # -> .../backend
ENV_FILE = BACKEND_ROOT / ".env"

class Settings(BaseSettings):
    # Required
    supabase_url: str = Field(..., alias="SUPABASE_URL")
    supabase_service_key: str = Field(
        ...,
        validation_alias=AliasChoices("SUPABASE_SERVICE_KEY", "SUPABASE_SERVICE_ROLE_KEY"),
    )

    # Optional extras won’t crash things if present in .env
    google_api_key: str | None = Field(None, alias="GOOGLE_API_KEY")

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()

# quick manual test
if __name__ == "__main__":
    s = get_settings()
    print(f"CWD-resilient env path: {ENV_FILE}")
    print(f"URL: {s.supabase_url}")
    print(f"Key: {s.supabase_service_key[:10]}...")
