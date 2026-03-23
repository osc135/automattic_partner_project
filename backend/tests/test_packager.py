import io
import zipfile

from app.packager import package_theme


class TestPackageTheme:
    def _sample_files(self):
        return {
            "style.css": "/* Theme Name: Test */",
            "theme.json": '{"version": 3}',
            "functions.php": "<?php // setup",
            "templates/index.html": "<!-- wp:paragraph --><p>Hi</p><!-- /wp:paragraph -->",
        }

    def test_returns_valid_zip_bytes(self):
        result = package_theme("test-theme", self._sample_files())
        assert isinstance(result, bytes)
        zf = zipfile.ZipFile(io.BytesIO(result))
        assert zf.testzip() is None  # No corrupt files

    def test_zip_contains_all_files(self):
        files = self._sample_files()
        result = package_theme("test-theme", files)
        zf = zipfile.ZipFile(io.BytesIO(result))
        names = zf.namelist()
        for file_path in files:
            assert f"test-theme/{file_path}" in names

    def test_zip_uses_slug_as_root_directory(self):
        result = package_theme("my-blog", self._sample_files())
        zf = zipfile.ZipFile(io.BytesIO(result))
        for name in zf.namelist():
            assert name.startswith("my-blog/")

    def test_file_contents_preserved(self):
        files = self._sample_files()
        result = package_theme("test-theme", files)
        zf = zipfile.ZipFile(io.BytesIO(result))
        css_content = zf.read("test-theme/style.css").decode("utf-8")
        assert css_content == files["style.css"]

    def test_subdirectories_created(self):
        result = package_theme("test-theme", self._sample_files())
        zf = zipfile.ZipFile(io.BytesIO(result))
        assert "test-theme/templates/index.html" in zf.namelist()

    def test_empty_files_dict(self):
        result = package_theme("empty-theme", {})
        assert isinstance(result, bytes)
        zf = zipfile.ZipFile(io.BytesIO(result))
        assert len(zf.namelist()) == 0
