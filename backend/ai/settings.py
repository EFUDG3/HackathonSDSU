from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_ROOT = Path(__file__).resolve().parents[1]        # points to /backend
DEFAULT_DATA = BACKEND_ROOT / "app" / "data"              # backend/app/data
DATA_PATH = Path(os.getenv("DATA_DIR", DEFAULT_DATA)).resolve()

# Supabase / table / RPC / model
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_TABLE_NAME = os.getenv("SUPABASE_TABLE_NAME", "banking_handbook")
RPC_NAME = os.getenv("RPC_NAME", "match_banking_handbook")
EMBED_MODEL = os.getenv("EMBED_MODEL", "intfloat/e5-base-v2")
