import json
import os

import pytest

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def valid_brief_data():
    """A valid theme brief as a dict, ready to POST."""
    return {
        "use_case": "blog",
        "description": "A dark photography blog with moody tones",
        "color_preference": "bold",
        "typography_preference": "modern sans-serif",
        "layout_preference": "centred hero",
        "notes": "Include a large gallery section",
    }


@pytest.fixture
def valid_theme_output():
    """Load the valid theme output fixture."""
    with open(os.path.join(FIXTURES_DIR, "valid_theme_output.json")) as f:
        return f.read()


@pytest.fixture
def valid_theme_files():
    """Load the valid theme output fixture as a parsed dict."""
    with open(os.path.join(FIXTURES_DIR, "valid_theme_output.json")) as f:
        return json.load(f)
