"""Grades a generated theme design against quality criteria and user brief alignment."""

import json
from typing import Any, Dict

from app.ai_provider import get_ai_provider

GRADER_SYSTEM_PROMPT = """You are a design critic grading an AI-generated WordPress theme design specification.

You will receive the user's original brief and the generated design spec. Grade the output on a scale of 1-100 for each category.

Return ONLY valid JSON with this exact structure:

{
  "overall_score": 85,
  "overall_summary": "One sentence summary of the overall quality",
  "categories": [
    {
      "name": "Brief Alignment",
      "score": 90,
      "reasoning": "2-3 sentences explaining how well the output matches what the user asked for — use case, description, color preference, typography, layout, and any notes."
    },
    {
      "name": "Color Harmony",
      "score": 80,
      "reasoning": "2-3 sentences on whether the colors work together, have enough contrast, and suit the use case."
    },
    {
      "name": "Typography",
      "score": 85,
      "reasoning": "2-3 sentences on whether the font pairing makes sense and fits the mood."
    },
    {
      "name": "Copy Quality",
      "score": 75,
      "reasoning": "2-3 sentences on whether the hero heading has a point of view, section labels are specific, and voice is consistent."
    },
    {
      "name": "Overall Cohesion",
      "score": 88,
      "reasoning": "2-3 sentences on whether all pieces feel intentional and designed together."
    }
  ]
}

## Grading Scale
- 90-100: Exceptional — professional quality, strong point of view
- 75-89: Good — solid output with minor areas for improvement
- 60-74: Average — functional but lacks personality or has misalignments
- 40-59: Below average — noticeable issues with alignment or quality
- 1-39: Poor — significant problems, does not match the brief

## Rules
- Be honest and specific. Don't inflate scores.
- Reference specific elements from the brief and design spec in your reasoning.
- If the user asked for something specific (e.g., "dark mode", "earth tones") and the output doesn't reflect it, that should lower the Brief Alignment score significantly.
- Generic copy like "Welcome to" or "Our Features" should lower Copy Quality.
- The overall_score should be a weighted average — Brief Alignment matters most.

Return ONLY the JSON. No explanation, no markdown fences.
"""


def grade_theme(brief_data: Dict[str, Any], design: Dict[str, Any]) -> Dict[str, Any]:
    """Grade a generated theme design against the user's brief.

    Returns the parsed grade object or a fallback if grading fails.
    """
    user_prompt = (
        f"## User's Original Brief\n\n"
        f"{json.dumps(brief_data, indent=2)}\n\n"
        f"## Generated Design Specification\n\n"
        f"{json.dumps(design, indent=2)}\n\n"
        f"Grade this output."
    )

    try:
        provider = get_ai_provider()
        raw_response = provider.generate(GRADER_SYSTEM_PROMPT, user_prompt)

        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned[cleaned.index("\n") + 1:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        grade = json.loads(cleaned)

        # Basic validation
        if "overall_score" not in grade or "categories" not in grade:
            return _fallback_grade()

        return grade

    except Exception:
        return _fallback_grade()


def _fallback_grade() -> Dict[str, Any]:
    """Return a neutral fallback grade if grading fails."""
    return {
        "overall_score": None,
        "overall_summary": "Grading unavailable for this theme.",
        "categories": [],
    }
