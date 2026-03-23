import os

from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
AI_MODEL: str = os.getenv("AI_MODEL", "claude-sonnet-4-20250514")
AI_MAX_TOKENS: int = int(os.getenv("AI_MAX_TOKENS", "8192"))
