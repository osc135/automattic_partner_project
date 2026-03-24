import json
from typing import Any, Dict, List


class ThemeValidationError(Exception):
    """Raised when AI-generated theme output fails validation."""

    def __init__(self, message: str, details: List[str] = None):
        self.message = message
        self.details = details or []
        super().__init__(self.message)


def validate_design_spec(raw_response: str) -> Dict[str, Any]:
    """Validate the AI's design specification JSON.

    Returns the parsed design dict or raises ThemeValidationError.
    """
    # Strip markdown code fences if the AI wrapped its response
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        first_newline = cleaned.index("\n")
        cleaned = cleaned[first_newline + 1:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    # Parse JSON
    try:
        design = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ThemeValidationError(
            "AI response is not valid JSON",
            details=[str(e)],
        )

    if not isinstance(design, dict):
        raise ThemeValidationError(
            "AI response must be a JSON object",
            details=["Expected a design specification object"],
        )

    # Validate required top-level keys
    errors: List[str] = []
    required_keys = ["theme_name", "colors", "fonts", "hero", "features", "footer"]
    for key in required_keys:
        if key not in design:
            errors.append(f"Missing required key: {key}")

    # Validate colors
    colors = design.get("colors", {})
    required_colors = ["base", "surface", "foreground", "muted", "accent", "accent_foreground"]
    for color_key in required_colors:
        if color_key not in colors:
            errors.append(f"Missing color: {color_key}")
        elif not isinstance(colors[color_key], str) or not colors[color_key].startswith("#"):
            errors.append(f"Invalid color value for {color_key}: must be a hex color string")

    # Validate fonts
    fonts = design.get("fonts", {})
    if "heading" not in fonts:
        errors.append("Missing fonts.heading")
    if "body" not in fonts:
        errors.append("Missing fonts.body")

    # Validate hero
    hero = design.get("hero", {})
    if "heading" not in hero:
        errors.append("Missing hero.heading")

    # Validate features
    features = design.get("features", {})
    items = features.get("items", [])
    if not isinstance(items, list) or len(items) < 3:
        errors.append("features.items must contain at least 3 items")

    # Validate footer
    footer = design.get("footer", {})
    columns = footer.get("columns", [])
    if not isinstance(columns, list) or len(columns) < 2:
        errors.append("footer.columns must contain at least 2 columns")

    if errors:
        raise ThemeValidationError(
            f"Design specification validation failed with {len(errors)} error(s)",
            details=errors,
        )

    return design


def validate_theme_files(theme_files: Dict[str, str]) -> None:
    """Validate the assembled theme files for basic correctness.

    Raises ThemeValidationError if checks fail.
    """
    from app.prompt import REQUIRED_FILES

    errors: List[str] = []

    # Check all required files present
    for f in REQUIRED_FILES:
        if f not in theme_files:
            errors.append(f"Missing required file: {f}")

    # Check no Custom HTML blocks
    for path, content in theme_files.items():
        if "<!-- wp:html -->" in content or "<!-- wp:html " in content:
            errors.append(f"Custom HTML block detected in {path}")

    # Check theme.json is valid JSON
    theme_json = theme_files.get("theme.json", "")
    try:
        json.loads(theme_json)
    except json.JSONDecodeError as e:
        errors.append(f"theme.json is not valid JSON: {e}")

    # Check style.css header
    style_css = theme_files.get("style.css", "")
    for field in ["Theme Name:", "Version:", "Description:"]:
        if field not in style_css:
            errors.append(f"style.css missing header field: {field}")

    if errors:
        raise ThemeValidationError(
            f"Theme file validation failed with {len(errors)} error(s)",
            details=errors,
        )
