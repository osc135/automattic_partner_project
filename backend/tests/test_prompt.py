from app.models import ThemeBrief
from app.prompt import build_system_prompt, build_user_prompt


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
    def test_contains_design_spec_structure(self):
        prompt = build_system_prompt()
        assert "theme_name" in prompt
        assert "colors" in prompt
        assert "fonts" in prompt
        assert "hero" in prompt
        assert "features" in prompt
        assert "footer" in prompt

    def test_contains_archetypes(self):
        prompt = build_system_prompt()
        assert "Editorial" in prompt
        assert "Bold SaaS" in prompt
        assert "Minimal Portfolio" in prompt
        assert "Warm & Approachable" in prompt

    def test_contains_allowed_fonts(self):
        prompt = build_system_prompt()
        assert "Montserrat" in prompt
        assert "DM Sans" in prompt
        assert "Open Sans" in prompt

    def test_bans_generic_copy(self):
        prompt = build_system_prompt()
        assert "Welcome to" in prompt  # listed as forbidden
        assert "Our Features" in prompt  # listed as forbidden
        assert "NEVER" in prompt

    def test_requires_json_output(self):
        prompt = build_system_prompt()
        assert "JSON" in prompt


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
