import re


def strip_html_tags(text: str) -> str:
    """Remove all HTML tags from a string."""
    return re.sub(r"<[^>]+>", "", text)


def sanitize_theme_slug(description: str) -> str:
    """Generate a sanitized theme slug from a description string.

    Returns a lowercase string containing only letters, numbers, and hyphens.
    """
    slug = description.lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s]+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug)
    slug = slug.strip("-")
    return slug[:40] or "generated-theme"


def sanitize_brief_field(text: str) -> str:
    """Sanitize a freeform brief field: strip HTML and trim whitespace."""
    return strip_html_tags(text).strip()
