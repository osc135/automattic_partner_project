import json

import pytest

from app.validator import ThemeValidationError, validate_theme_output


def _make_valid_theme_files():
    """Return a minimal valid theme file dict."""
    return {
        "style.css": (
            "/*\n"
            "Theme Name: Test Theme\n"
            "Version: 1.0.0\n"
            "Description: A test theme\n"
            "*/"
        ),
        "theme.json": json.dumps(
            {"version": 3, "settings": {}, "styles": {}}
        ),
        "functions.php": "<?php\nadd_action('after_setup_theme', function() {});",
        "templates/index.html": (
            '<!-- wp:template-part {"slug":"header","area":"header"} /-->\n'
            "<!-- wp:group -->\n<div>\n<!-- wp:paragraph -->\n"
            "<p>Hello</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n"
            '<!-- wp:template-part {"slug":"footer","area":"footer"} /-->'
        ),
        "templates/single.html": (
            '<!-- wp:template-part {"slug":"header","area":"header"} /-->\n'
            "<!-- wp:post-content /-->\n"
            '<!-- wp:template-part {"slug":"footer","area":"footer"} /-->'
        ),
        "templates/page.html": (
            '<!-- wp:template-part {"slug":"header","area":"header"} /-->\n'
            "<!-- wp:post-content /-->\n"
            '<!-- wp:template-part {"slug":"footer","area":"footer"} /-->'
        ),
        "parts/header.html": (
            "<!-- wp:group -->\n<div>\n"
            "<!-- wp:site-title /-->\n"
            "</div>\n<!-- /wp:group -->"
        ),
        "parts/footer.html": (
            "<!-- wp:group -->\n<div>\n"
            "<!-- wp:paragraph -->\n<p>Footer</p>\n<!-- /wp:paragraph -->\n"
            "</div>\n<!-- /wp:group -->"
        ),
        "patterns/hero.php": (
            "<?php\n/**\n * Title: Hero\n * Slug: test-theme/hero\n */\n?>\n"
            "<!-- wp:group -->\n<div>\n"
            "<!-- wp:heading -->\n<h2>Welcome</h2>\n<!-- /wp:heading -->\n"
            "</div>\n<!-- /wp:group -->"
        ),
        "patterns/features.php": (
            "<?php\n/**\n * Title: Features\n * Slug: test-theme/features\n */\n?>\n"
            "<!-- wp:group -->\n<div>\n"
            "<!-- wp:heading -->\n<h2>Features</h2>\n<!-- /wp:heading -->\n"
            "</div>\n<!-- /wp:group -->"
        ),
    }


class TestValidateThemeOutput:
    def test_valid_output_passes(self):
        raw = json.dumps(_make_valid_theme_files())
        result = validate_theme_output(raw)
        assert "style.css" in result
        assert len(result) == 10

    def test_strips_markdown_code_fences(self):
        raw = "```json\n" + json.dumps(_make_valid_theme_files()) + "\n```"
        result = validate_theme_output(raw)
        assert "style.css" in result

    def test_invalid_json_raises(self):
        with pytest.raises(ThemeValidationError, match="not valid JSON"):
            validate_theme_output("not json at all")

    def test_non_object_json_raises(self):
        with pytest.raises(ThemeValidationError, match="JSON object"):
            validate_theme_output('["an", "array"]')

    def test_missing_required_files_raises(self):
        files = _make_valid_theme_files()
        del files["templates/index.html"]
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert "templates/index.html" in str(exc_info.value.details)

    def test_custom_html_block_detected(self):
        files = _make_valid_theme_files()
        files["templates/index.html"] = (
            "<!-- wp:html -->\n<div>bad</div>\n<!-- /wp:html -->"
        )
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert any("Custom HTML" in d for d in exc_info.value.details)

    def test_custom_html_with_attrs_detected(self):
        files = _make_valid_theme_files()
        files["parts/header.html"] = (
            '<!-- wp:html {"lock":true} -->\n<div>bad</div>\n<!-- /wp:html -->'
        )
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert any("Custom HTML" in d for d in exc_info.value.details)

    def test_mismatched_blocks_detected(self):
        files = _make_valid_theme_files()
        files["templates/index.html"] = (
            "<!-- wp:group -->\n<div>\n"
            "<!-- wp:paragraph -->\n<p>Hello</p>\n<!-- /wp:paragraph -->\n"
            # Missing closing wp:group
        )
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert any("Mismatched" in d for d in exc_info.value.details)

    def test_invalid_theme_json_detected(self):
        files = _make_valid_theme_files()
        files["theme.json"] = "not valid json"
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert any("theme.json" in d for d in exc_info.value.details)

    def test_missing_style_css_header_detected(self):
        files = _make_valid_theme_files()
        files["style.css"] = "/* nothing useful */"
        with pytest.raises(ThemeValidationError) as exc_info:
            validate_theme_output(json.dumps(files))
        assert any("style.css" in d for d in exc_info.value.details)

    def test_self_closing_blocks_dont_need_closers(self):
        files = _make_valid_theme_files()
        files["templates/index.html"] = (
            '<!-- wp:template-part {"slug":"header"} /-->\n'
            "<!-- wp:post-content /-->\n"
            '<!-- wp:template-part {"slug":"footer"} /-->'
        )
        result = validate_theme_output(json.dumps(files))
        assert "templates/index.html" in result
