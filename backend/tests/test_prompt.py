from app.models import ThemeBrief
from app.prompt import REQUIRED_FILES, build_system_prompt, build_user_prompt


def _make_brief(**overrides):
    defaults = {
        "use_case": "blog",
        "description": "A dark photography blog",
        "color_preference": "bold",
        "typography_preference": "modern sans-serif",
    }
    defaults.update(overrides)
    return ThemeBrief(**defaults)


class TestBuildSystemPrompt:
    def test_contains_all_required_files(self):
        prompt = build_system_prompt()
        for f in REQUIRED_FILES:
            assert f in prompt

    def test_contains_wordpress_rules(self):
        prompt = build_system_prompt()
        assert "wp:paragraph" in prompt
        assert "wp:html" in prompt  # mentioned as forbidden

    def test_contains_all_five_rule_categories(self):
        prompt = build_system_prompt()
        assert "Rule 1" in prompt
        assert "Rule 2" in prompt
        assert "Rule 3" in prompt
        assert "Rule 4" in prompt
        assert "Rule 5" in prompt

    def test_forbids_custom_html_block(self):
        prompt = build_system_prompt()
        assert "Do NOT use the Custom HTML block" in prompt

    def test_requires_json_output(self):
        prompt = build_system_prompt()
        assert "valid JSON" in prompt


class TestBuildUserPrompt:
    def test_contains_brief_fields(self):
        brief = _make_brief()
        prompt = build_user_prompt(brief, "a-dark-photography-blog")
        assert "blog" in prompt
        assert "A dark photography blog" in prompt
        assert "bold" in prompt
        assert "modern sans-serif" in prompt

    def test_contains_theme_slug(self):
        brief = _make_brief()
        prompt = build_user_prompt(brief, "my-theme")
        assert "my-theme" in prompt

    def test_includes_optional_fields_when_provided(self):
        brief = _make_brief(
            layout_preference="centred hero",
            notes="Include a large gallery section",
        )
        prompt = build_user_prompt(brief, "test-theme")
        assert "centred hero" in prompt
        assert "Include a large gallery section" in prompt

    def test_optional_fields_null_when_omitted(self):
        brief = _make_brief()
        prompt = build_user_prompt(brief, "test-theme")
        assert '"layout_preference": null' in prompt
        assert '"notes": null' in prompt
