import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.ai_provider import get_ai_provider
from app.models import ThemeBrief, ThemeGenerationError
from app.packager import package_theme
from app.prompt import build_system_prompt, build_user_prompt
from app.sanitize import sanitize_brief_field, sanitize_theme_slug
from app.validator import ThemeValidationError, validate_theme_output

logger = logging.getLogger(__name__)

app = FastAPI(title="WordPress Theme Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/generate")
def generate_theme(brief: ThemeBrief):
    """Generate a WordPress Block Theme from a user brief.

    Orchestrates: sanitize → prompt → AI → validate → package → respond.
    """
    # Sanitize freeform fields
    brief.description = sanitize_brief_field(brief.description)
    if brief.notes:
        brief.notes = sanitize_brief_field(brief.notes)

    # Generate theme slug
    theme_slug = sanitize_theme_slug(brief.description)

    # Build prompts
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(brief, theme_slug)

    # Call AI provider
    try:
        provider = get_ai_provider()
        raw_response = provider.generate(system_prompt, user_prompt)
    except Exception as e:
        logger.error("AI provider error: %s", e)
        return JSONResponse(
            status_code=502,
            content=ThemeGenerationError(
                error="AI generation failed. Please try again shortly.",
                details=[str(e)],
            ).model_dump(),
        )

    # Validate AI output
    try:
        theme_files = validate_theme_output(raw_response)
    except ThemeValidationError as e:
        logger.warning("Theme validation failed: %s", e.details)
        return JSONResponse(
            status_code=400,
            content=ThemeGenerationError(
                error=e.message,
                details=e.details,
            ).model_dump(),
        )

    # Package and return ZIP
    zip_bytes = package_theme(theme_slug, theme_files)

    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{theme_slug}.zip"'
        },
    )
