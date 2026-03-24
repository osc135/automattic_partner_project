import json

from app.models import ThemeBrief

REQUIRED_FILES = [
    "style.css",
    "theme.json",
    "functions.php",
    "templates/index.html",
    "templates/single.html",
    "templates/page.html",
    "parts/header.html",
    "parts/footer.html",
    "patterns/hero.php",
    "patterns/features.php",
]

SYSTEM_PROMPT = """You are a WordPress theme design assistant. Given a user brief, return a JSON object describing the theme's design tokens and content. Do NOT return any WordPress markup or file contents — just the design specification.

Return ONLY valid JSON with this exact structure:

{
  "theme_name": "Human-readable theme name",
  "description": "One-sentence theme description",
  "colors": {
    "background": "#hex (main site background)",
    "foreground": "#hex (main text color)",
    "primary": "#hex (brand/accent color)",
    "secondary": "#hex (secondary accent)",
    "accent": "#hex (highlights, links, buttons)",
    "muted": "#hex (subtle backgrounds, borders)"
  },
  "fonts": {
    "heading": "web-safe font stack for headings (e.g. Georgia, 'Times New Roman', serif)",
    "body": "web-safe font stack for body text (e.g. system-ui, -apple-system, sans-serif)"
  },
  "hero": {
    "heading": "Main hero headline text",
    "subheading": "Supporting text below the headline (1-2 sentences)"
  },
  "features": {
    "heading": "Section heading for the features area",
    "items": [
      {
        "title": "Feature 1 title",
        "description": "Feature 1 description (1 sentence)"
      },
      {
        "title": "Feature 2 title",
        "description": "Feature 2 description (1 sentence)"
      },
      {
        "title": "Feature 3 title",
        "description": "Feature 3 description (1 sentence)"
      }
    ]
  },
  "footer": {
    "columns": [
      {
        "heading": "Column 1 heading",
        "text": "Column 1 content (1-2 sentences)"
      },
      {
        "heading": "Column 2 heading",
        "text": "Column 2 content (1-2 sentences)"
      },
      {
        "heading": "Column 3 heading",
        "text": "Column 3 content (1-2 sentences)"
      }
    ],
    "copyright": "Copyright line text"
  }
}

## Guidelines

- Choose colors that match the user's color preference (basic = muted/neutral, medium = balanced, bold = high contrast/saturated).
- Choose fonts that match the typography preference. Use ONLY web-safe fonts: system-ui, Georgia, 'Times New Roman', Arial, Helvetica, 'Courier New', etc. Do not reference Google Fonts.
- Write all content to match the use case and description. Make it sound like a real site — no placeholder text.
- The hero should be compelling and specific to the site's purpose.
- Features should highlight 3 key aspects relevant to the use case.
- Footer columns should have relevant info (about, categories/links, contact).
- Theme name should be creative and reflect the site's purpose.

Return ONLY the JSON object. No explanation, no markdown fences.
"""


def build_system_prompt() -> str:
    """Build the system prompt for design token generation."""
    return SYSTEM_PROMPT


def build_user_prompt(brief: ThemeBrief, theme_slug: str) -> str:
    """Build the user prompt containing the theme brief."""
    brief_data = {
        "use_case": brief.use_case,
        "description": brief.description,
        "color_preference": brief.color_preference,
        "typography_preference": brief.typography_preference,
        "layout_preference": brief.layout_preference,
        "notes": brief.notes,
        "theme_slug": theme_slug,
    }
    return (
        f"Design a WordPress theme based on this brief:\n\n"
        f"{json.dumps(brief_data, indent=2)}\n\n"
        f"Return the design specification JSON."
    )
