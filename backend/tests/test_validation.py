import pytest
from pydantic import ValidationError

from app.models import ThemeBrief
from app.sanitize import sanitize_brief_field, sanitize_theme_slug, strip_html_tags


class TestStripHtmlTags:
    def test_removes_simple_tags(self):
        assert strip_html_tags("<b>bold</b>") == "bold"

    def test_removes_nested_tags(self):
        assert strip_html_tags("<div><p>text</p></div>") == "text"

    def test_removes_tags_with_attributes(self):
        assert strip_html_tags('<a href="url">link</a>') == "link"

    def test_passes_plain_text(self):
        assert strip_html_tags("no tags here") == "no tags here"

    def test_handles_empty_string(self):
        assert strip_html_tags("") == ""

    def test_removes_script_tags(self):
        assert strip_html_tags("<script>alert('xss')</script>") == "alert('xss')"


class TestSanitizeThemeSlug:
    def test_basic_description(self):
        assert sanitize_theme_slug("My Photography Blog") == "my-photography-blog"

    def test_strips_special_characters(self):
        assert sanitize_theme_slug("A cool site! #1") == "a-cool-site-1"

    def test_collapses_multiple_hyphens(self):
        assert sanitize_theme_slug("hello   world") == "hello-world"

    def test_truncates_long_slugs(self):
        slug = sanitize_theme_slug("a" * 100)
        assert len(slug) <= 40

    def test_handles_all_special_chars(self):
        assert sanitize_theme_slug("!!!@@@###") == "generated-theme"

    def test_strips_leading_trailing_hyphens(self):
        assert sanitize_theme_slug(" - hello - ") == "hello"

    def test_unicode_characters_removed(self):
        slug = sanitize_theme_slug("café résumé")
        assert slug == "caf-rsum"


class TestSanitizeBriefField:
    def test_strips_html_and_trims(self):
        assert sanitize_brief_field("  <b>hello</b>  ") == "hello"

    def test_plain_text_trimmed(self):
        assert sanitize_brief_field("  some text  ") == "some text"


class TestThemeBrief:
    def _valid_brief(self, **overrides):
        defaults = {
            "use_case": "blog",
            "description": "A dark photography blog",
            "color_preference": "bold",
            "typography_preference": "modern sans-serif",
        }
        defaults.update(overrides)
        return defaults

    def test_valid_brief_creates_model(self):
        brief = ThemeBrief(**self._valid_brief())
        assert brief.use_case == "blog"
        assert brief.description == "A dark photography blog"

    def test_missing_required_field_raises(self):
        with pytest.raises(ValidationError):
            ThemeBrief(
                use_case="blog",
                color_preference="bold",
                typography_preference="modern sans-serif",
            )

    def test_description_max_length_enforced(self):
        with pytest.raises(ValidationError):
            ThemeBrief(**self._valid_brief(description="x" * 501))

    def test_description_at_max_length_ok(self):
        brief = ThemeBrief(**self._valid_brief(description="x" * 500))
        assert len(brief.description) == 500

    def test_notes_max_length_enforced(self):
        with pytest.raises(ValidationError):
            ThemeBrief(**self._valid_brief(notes="x" * 301))

    def test_optional_fields_default_to_none(self):
        brief = ThemeBrief(**self._valid_brief())
        assert brief.layout_preference is None
        assert brief.notes is None
        assert brief.theme_slug is None

    def test_generate_slug(self):
        brief = ThemeBrief(**self._valid_brief())
        assert brief.generate_slug() == "a-dark-photography-blog"

    def test_user_provided_slug_is_discarded(self):
        brief = ThemeBrief(**self._valid_brief(theme_slug="user-provided"))
        assert brief.theme_slug is None

    def test_empty_use_case_rejected(self):
        with pytest.raises(ValidationError):
            ThemeBrief(**self._valid_brief(use_case=""))

    def test_custom_use_case_accepted(self):
        brief = ThemeBrief(**self._valid_brief(use_case="dog grooming salon"))
        assert brief.use_case == "dog grooming salon"
