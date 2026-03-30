import base64
import logging
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.ai_provider import get_ai_provider
from app.color_extractor import extract_palette
from app.grader import grade_theme
from app.models import ThemeBrief, ThemeGenerationError
from app.packager import package_theme
from app.prompt import build_system_prompt, build_user_prompt
from app.sanitize import sanitize_brief_field, sanitize_theme_slug
from app.theme_builder import build_theme_files
from app.validator import ThemeValidationError, validate_design_spec, validate_theme_files

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WordPress Theme Generator API")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/extract-palette")
def extract_palette_endpoint(body: dict):
    """Extract a color palette from a description."""
    description = body.get("description", "")
    if not description.strip():
        return {"palette": None}

    logger.info("🎨 Extracting palette from description...")
    palette = extract_palette(description)
    logger.info("🎨 Palette result: %s", palette)
    return {"palette": palette}


@app.post("/api/generate")
def generate_theme(brief: ThemeBrief):
    """Generate a WordPress Block Theme from a user brief.

    Flow: sanitize → prompt → AI (design JSON) → validate design →
          build theme files from templates → validate files → ZIP → respond.
    """
    # Sanitize freeform fields
    logger.info("📥 Received brief: use_case=%s, color=%s, typography=%s",
                brief.use_case, brief.color_preference, brief.typography_preference)
    brief.description = sanitize_brief_field(brief.description)
    if brief.notes:
        brief.notes = sanitize_brief_field(brief.notes)

    # Generate theme slug
    theme_slug = sanitize_theme_slug(brief.description)
    logger.info("🏷️  Theme slug: %s", theme_slug)

    # Build prompts
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(brief, theme_slug)
    logger.info("📝 Prompts built. Calling AI for design spec...")

    # Call AI provider — returns design tokens + content, NOT markup
    try:
        provider = get_ai_provider()
        raw_response = provider.generate(system_prompt, user_prompt)
        logger.info("✅ AI response received (%d chars)", len(raw_response))
    except Exception as e:
        logger.error("❌ AI provider error: %s", e)
        return JSONResponse(
            status_code=502,
            content=ThemeGenerationError(
                error="AI generation failed. Please try again shortly.",
                details=[str(e)],
            ).model_dump(),
        )

    # Validate design specification
    try:
        logger.info("🔍 Validating design spec...")
        design = validate_design_spec(raw_response)
        logger.info("✅ Design spec valid. Theme: %s", design.get("theme_name"))
    except ThemeValidationError as e:
        logger.warning("❌ Design spec validation failed: %s", e.details)
        return JSONResponse(
            status_code=400,
            content=ThemeGenerationError(
                error=e.message,
                details=e.details,
            ).model_dump(),
        )

    # Build theme files from templates + design spec
    logger.info("🔨 Building theme files from templates...")
    theme_files = build_theme_files(design, theme_slug)

    # Validate assembled files
    try:
        validate_theme_files(theme_files)
        logger.info("✅ Theme files valid. Files: %s", list(theme_files.keys()))
    except ThemeValidationError as e:
        logger.warning("❌ Theme file validation failed: %s", e.details)
        return JSONResponse(
            status_code=400,
            content=ThemeGenerationError(
                error=e.message,
                details=e.details,
            ).model_dump(),
        )

    # Package ZIP
    zip_bytes = package_theme(theme_slug, theme_files)
    zip_base64 = base64.b64encode(zip_bytes).decode("utf-8")
    logger.info("📦 ZIP packaged (%d bytes).", len(zip_bytes))

    # Grade the output
    logger.info("📊 Grading theme output...")
    brief_data = {
        "use_case": brief.use_case,
        "description": brief.description,
        "color_preference": brief.color_preference,
        "typography_preference": brief.typography_preference,
        "layout_preference": brief.layout_preference,
        "notes": brief.notes,
    }
    grade = grade_theme(brief_data, design)
    logger.info("📊 Grade: %s", grade.get("overall_score"))

    return {
        "design": design,
        "theme_slug": theme_slug,
        "zip_base64": zip_base64,
        "filename": f"{theme_slug}.zip",
        "grade": grade,
    }


# Serve frontend static files in production
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
if STATIC_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
