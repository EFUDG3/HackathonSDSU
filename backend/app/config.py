# this is to define configuration for the supabase client using pydantic
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8'
    )


# this helps reduce the function time of a commonly called function using memoization
@lru_cache
def get_settings():
    return Settings()


# testing here
# At the bottom of config.py temporarily
if __name__ == "__main__":
    settings = get_settings()
    print(f"URL: {settings.supabase_url}")
    print(f"Key: {settings.supabase_service_key[:10]}...")  # Only show first 10 chars




