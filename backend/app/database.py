from supabase import create_client
import os
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@lru_cache()
def get_supabase_client():
    """Get a cached Supabase client instance."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url:
        raise ValueError("SUPABASE_URL environment variable is not set")
    if not key:
        raise ValueError("SUPABASE_KEY environment variable is not set")
    
    try:
        client = create_client(url, key)
        print(f"Successfully connected to Supabase at {url}")
        return client
    except Exception as e:
        print(f"Error connecting to Supabase: {str(e)}")
        raise