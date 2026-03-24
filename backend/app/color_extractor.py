"""Extracts a color palette from a user's description using a cheap OpenAI model."""

import json
import logging
from typing import Any, Dict, Optional

from app.ai_provider import get_color_provider

logger = logging.getLogger(__name__)

EXTRACTOR_PROMPT = """You are a color palette extractor. Given a site description, extract or infer a 5-color palette that matches the described visual style.

Return ONLY valid JSON:

{
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "name": "Short 1-2 word palette name",
  "description": "One short sentence describing the palette"
}

Rules:
- The 5 colors should go from darkest to lightest (or most dominant to least).
- If the user describes specific colors, use those.
- If the user describes a mood or feel, infer appropriate colors.
- Colors must be clean hex values.
- The palette should work for a website — include at least one dark, one light, and one accent color.

Return ONLY the JSON. No explanation.
"""


def extract_palette(description: str) -> Optional[Dict[str, Any]]:
    """Extract a color palette from a description using gpt-4o-mini.

    Returns None if extraction fails.
    """
    try:
        provider = get_color_provider()
        raw = provider.generate(
            EXTRACTOR_PROMPT,
            f"Extract a color palette from this description:\n\n{description}",
        )

        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned[cleaned.index("\n") + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        result = json.loads(cleaned)

        if "colors" not in result or not isinstance(result["colors"], list):
            return None
        if len(result["colors"]) < 3:
            return None
        if not all(isinstance(c, str) and c.startswith("#") for c in result["colors"]):
            return None

        return result

    except Exception as e:
        logger.warning("Color extraction failed: %s", e)
        return None
