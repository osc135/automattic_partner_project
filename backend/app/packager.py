import io
import zipfile
from typing import Dict


def package_theme(theme_slug: str, files: Dict[str, str]) -> bytes:
    """Package validated theme files into a ZIP archive.

    Returns the ZIP file as bytes. The archive uses the theme slug as
    the root directory, matching WordPress theme installation expectations.
    """
    buffer = io.BytesIO()

    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path, content in files.items():
            archive_path = f"{theme_slug}/{file_path}"
            zf.writestr(archive_path, content)

    return buffer.getvalue()
