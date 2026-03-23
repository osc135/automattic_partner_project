import json
import re
from typing import Dict, List

from app.prompt import REQUIRED_FILES


class ThemeValidationError(Exception):
    """Raised when AI-generated theme output fails validation."""

    def __init__(self, message: str, details: List[str] = None):
        self.message = message
        self.details = details or []
        super().__init__(self.message)


def _check_required_files(theme_files: Dict[str, str]) -> List[str]:
    """Check that all required files are present in the output."""
    missing = [f for f in REQUIRED_FILES if f not in theme_files]
    return [f"Missing required file: {f}" for f in missing]


def _check_custom_html_blocks(theme_files: Dict[str, str]) -> List[str]:
    """Detect forbidden Custom HTML blocks in any file."""
    errors = []
    for path, content in theme_files.items():
        if "<!-- wp:html -->" in content or "<!-- wp:html " in content:
            errors.append(
                f"Custom HTML block detected in {path}. "
                f"Only native WordPress blocks are allowed."
            )
    return errors


def _check_block_markup_matching(theme_files: Dict[str, str]) -> List[str]:
    """Verify that opening and closing block comments are matched."""
    errors = []
    open_pattern = re.compile(r"<!-- wp:(\S+?)[\s{]")
    close_pattern = re.compile(r"<!-- /wp:(\S+?) -->")
    self_closing_pattern = re.compile(r"<!-- wp:(\S+?)[\s{][^>]*/-->")

    for path, content in theme_files.items():
        if not path.endswith((".html", ".php")):
            continue

        self_closing = set()
        for match in self_closing_pattern.finditer(content):
            self_closing.add(match.start())

        open_blocks = []
        for match in open_pattern.finditer(content):
            if match.start() not in self_closing:
                open_blocks.append(match.group(1))

        close_blocks = []
        for match in close_pattern.finditer(content):
            close_blocks.append(match.group(1))

        open_counts: Dict[str, int] = {}
        for block in open_blocks:
            open_counts[block] = open_counts.get(block, 0) + 1

        close_counts: Dict[str, int] = {}
        for block in close_blocks:
            close_counts[block] = close_counts.get(block, 0) + 1

        all_blocks = set(list(open_counts.keys()) + list(close_counts.keys()))
        for block in all_blocks:
            opens = open_counts.get(block, 0)
            closes = close_counts.get(block, 0)
            if opens != closes:
                errors.append(
                    f"Mismatched block markup in {path}: "
                    f"wp:{block} has {opens} opening(s) and {closes} closing(s)"
                )

    return errors


def _check_theme_json(theme_files: Dict[str, str]) -> List[str]:
    """Validate that theme.json is valid JSON."""
    content = theme_files.get("theme.json", "")
    try:
        json.loads(content)
    except json.JSONDecodeError as e:
        return [f"theme.json is not valid JSON: {e}"]
    return []


def _check_style_css_header(theme_files: Dict[str, str]) -> List[str]:
    """Validate that style.css contains required WordPress theme header fields."""
    content = theme_files.get("style.css", "")
    required_headers = ["Theme Name:", "Version:", "Description:"]
    missing = [h for h in required_headers if h not in content]
    if missing:
        return [f"style.css missing required header field(s): {', '.join(missing)}"]
    return []


def validate_theme_output(raw_response: str) -> Dict[str, str]:
    """Validate AI-generated theme output and return parsed file dict.

    Raises ThemeValidationError if any check fails.
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
        theme_files = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ThemeValidationError(
            "AI response is not valid JSON",
            details=[str(e)],
        )

    if not isinstance(theme_files, dict):
        raise ThemeValidationError(
            "AI response must be a JSON object",
            details=["Expected a mapping of file paths to file contents"],
        )

    # Run all validation checks
    errors: List[str] = []
    errors.extend(_check_required_files(theme_files))
    errors.extend(_check_custom_html_blocks(theme_files))
    errors.extend(_check_block_markup_matching(theme_files))
    errors.extend(_check_theme_json(theme_files))
    errors.extend(_check_style_css_header(theme_files))

    if errors:
        raise ThemeValidationError(
            f"Theme validation failed with {len(errors)} error(s)",
            details=errors,
        )

    return theme_files
