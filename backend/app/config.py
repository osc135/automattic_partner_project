import os

from dotenv import load_dotenv

load_dotenv()

# Main theme generation — Gemini (default), Anthropic as fallback
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
AI_MODEL: str = os.getenv("AI_MODEL", "gemini-2.5-flash")
AI_MAX_TOKENS: int = int(os.getenv("AI_MAX_TOKENS", "16384"))

# Fallback provider
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

# Color extraction — OpenAI (cheap)
OPENAI_API_KEY: str = os.getenv("CUSTOM_COLOR_GENERATION", "")
COLOR_GENERATION_MODEL: str = os.getenv("COLOR_GENERATION_MODEL", "gpt-4o-mini")
