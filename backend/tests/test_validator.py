import json

import pytest

from app.validator import ThemeValidationError, validate_design_spec, validate_theme_files


def _make_valid_design():
    """Return a minimal valid design specification."""
    return {
        "theme_name": "Test Theme",
        "description": "A test theme",
        "colors": {
            "background": "#ffffff",
            "foreground": "#1a1a1a",
            "primary": "#2563eb",
            "secondary": "#4f46e5",
            "accent": "#0891b2",
            "muted": "#f3f4f6",
        },
        "fonts": {
            "heading": "Georgia, serif",
            "body": "system-ui, sans-serif",
        },
        "hero": {
            "heading": "Welcome",
            "subheading": "A great site.",
        },
        "features": {
            "heading": "Features",
            "items": [
                {"title": "Fast", "description": "Very fast."},
                {"title": "Simple", "description": "Very simple."},
                {"title": "Clean", "description": "Very clean."},
            ],
        },
        "footer": {
            "columns": [
                {"heading": "About", "text": "About us."},
                {"heading": "Links", "text": "Some links."},
                {"heading": "Contact", "text": "Get in touch."},
            ],
            "copyright": "© 2024 Test Theme",
        },
    }


class TestValidateDesignSpec:
    def test_valid_design_passes(self):
        raw = json.dumps(_make_valid_design())
        result = validate_design_spec(raw)
        assert result["theme_name"] == "Test Theme"

    def test_strips_markdown_code_fences(self):
        raw = "```json\n" + json.dumps(_make_valid_design()) + "\n```"
        result = validate_design_spec(raw)
        assert result["theme_name"] == "Test Theme"

    def test_invalid_json_raises(self):
        with pytest.raises(ThemeValidationError, match="not valid JSON"):
            validate_design_spec("not json at all")

    def test_non_object_json_raises(self):
        with pytest.raises(ThemeValidationError, match="JSON object"):
            validate_design_spec('["an", "array"]')

    def test_missing_required_key_raises(self):
        design = _make_valid_design()
        del design["colors"]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("colors" in d for d in exc_info.value.details)

    def test_missing_color_raises(self):
        design = _make_valid_design()
        del design["colors"]["primary"]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("primary" in d for d in exc_info.value.details)

    def test_invalid_color_format_raises(self):
        design = _make_valid_design()
        design["colors"]["primary"] = "not-a-hex"
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("primary" in d for d in exc_info.value.details)

    def test_missing_fonts_raises(self):
        design = _make_valid_design()
        del design["fonts"]["heading"]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("heading" in d for d in exc_info.value.details)

    def test_too_few_feature_items_raises(self):
        design = _make_valid_design()
        design["features"]["items"] = [{"title": "One", "description": "Only one."}]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("items" in d for d in exc_info.value.details)

    def test_too_few_footer_columns_raises(self):
        design = _make_valid_design()
        design["footer"]["columns"] = [{"heading": "One", "text": "Only one."}]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_design_spec(json.dumps(design))
        assert any("columns" in d for d in exc_info.value.details)


class TestValidateThemeFiles:
    def test_valid_files_pass(self):
        from app.theme_builder import build_theme_files
        files = build_theme_files(_make_valid_design(), "test-theme")
        validate_theme_files(files)  # should not raise

    def test_missing_file_raises(self):
        from app.theme_builder import build_theme_files
        files = build_theme_files(_make_valid_design(), "test-theme")
        del files["templates/index.html"]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_files(files)
        assert any("index.html" in d for d in exc_info.value.details)

    def test_custom_html_block_raises(self):
        from app.theme_builder import build_theme_files
        files = build_theme_files(_make_valid_design(), "test-theme")
        files["templates/index.html"] = "<!-- wp:html --><div>bad</div><!-- /wp:html -->"
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_files(files)
        assert any("Custom HTML" in d for d in exc_info.value.details)
