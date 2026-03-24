import io
import json
import zipfile
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


class TestGenerateEndpoint:
    def test_successful_generation(self, client, valid_brief_data, valid_theme_output):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = valid_theme_output

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        assert response.status_code == 200
        assert response.headers["content-type"] == "application/zip"
        assert "attachment" in response.headers["content-disposition"]

        # Verify ZIP contents
        zf = zipfile.ZipFile(io.BytesIO(response.content))
        assert zf.testzip() is None
        names = zf.namelist()
        assert any("style.css" in n for n in names)
        assert any("theme.json" in n for n in names)
        assert any("templates/index.html" in n for n in names)

    def test_missing_required_field_returns_422(self, client):
        response = client.post(
            "/api/generate",
            json={"use_case": "blog", "color_preference": "bold"},
        )
        assert response.status_code == 422

    def test_description_too_long_returns_422(self, client, valid_brief_data):
        valid_brief_data["description"] = "x" * 501
        response = client.post("/api/generate", json=valid_brief_data)
        assert response.status_code == 422

    def test_ai_provider_failure_returns_502(self, client, valid_brief_data):
        mock_provider = MagicMock()
        mock_provider.generate.side_effect = RuntimeError("API timeout")

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        assert response.status_code == 502
        body = response.json()
        assert "error" in body
        assert "AI generation failed" in body["error"]

    def test_invalid_ai_output_returns_400(self, client, valid_brief_data):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = "not valid json at all"

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        assert response.status_code == 400
        body = response.json()
        assert "error" in body

    def test_ai_output_missing_colors_returns_400(self, client, valid_brief_data, valid_theme_files):
        del valid_theme_files["colors"]
        mock_provider = MagicMock()
        mock_provider.generate.return_value = json.dumps(valid_theme_files)

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        assert response.status_code == 400

    def test_html_tags_stripped_from_description(
        self, client, valid_brief_data, valid_theme_output
    ):
        valid_brief_data["description"] = "<script>alert('xss')</script>A nice blog"
        mock_provider = MagicMock()
        mock_provider.generate.return_value = valid_theme_output

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        assert response.status_code == 200

    def test_zip_filename_matches_slug(
        self, client, valid_brief_data, valid_theme_output
    ):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = valid_theme_output

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        disposition = response.headers["content-disposition"]
        assert ".zip" in disposition

    def test_generated_zip_has_valid_theme_json(
        self, client, valid_brief_data, valid_theme_output
    ):
        mock_provider = MagicMock()
        mock_provider.generate.return_value = valid_theme_output

        with patch("app.main.get_ai_provider", return_value=mock_provider):
            response = client.post("/api/generate", json=valid_brief_data)

        zf = zipfile.ZipFile(io.BytesIO(response.content))
        theme_json_path = [n for n in zf.namelist() if n.endswith("theme.json")][0]
        theme_json = json.loads(zf.read(theme_json_path))
        assert theme_json["version"] == 3
        assert "palette" in theme_json["settings"]["color"]


class TestHealthEndpoint:
    def test_health_check(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
