import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ThemeBrief(BaseModel):
    """Schema for the user's theme generation brief."""

    use_case: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    color_preference: str = Field(..., min_length=1, max_length=100)
    typography_preference: str = Field(..., min_length=1, max_length=100)
    layout_preference: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = Field(None, max_length=300)
    theme_slug: Optional[str] = Field(None, max_length=60)

    @field_validator("theme_slug", mode="before")
    @classmethod
    def ignore_user_slug(cls, v: Optional[str]) -> Optional[str]:
        """Theme slug is auto-generated; discard any user-provided value."""
        return None

    def generate_slug(self) -> str:
        """Generate a URL-safe theme slug from the description."""
        slug = self.description.lower()
        slug = re.sub(r"[^a-z0-9\s-]", "", slug)
        slug = re.sub(r"[\s]+", "-", slug.strip())
        slug = re.sub(r"-+", "-", slug)
        slug = slug.strip("-")
        return slug[:40] or "generated-theme"


class ThemeGenerationError(BaseModel):
    """Error response returned to the client."""

    error: str
    details: Optional[list[str]] = None
