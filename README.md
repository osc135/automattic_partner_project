# AI-Powered WordPress Block Theme Generator

A web application that generates complete, installable WordPress Block Themes from a guided user brief. Built with React/TypeScript (frontend) and Python/FastAPI (backend), powered by Anthropic Claude.

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- An Anthropic API key
- Docker (for testing themes in WordPress)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:8000`.

### Testing Themes in WordPress (Docker)

Spin up a local WordPress instance to test generated themes:

```bash
cd wordpress
docker compose up -d
```

WordPress will be available at `http://localhost:8080`. Complete the setup wizard, then:

1. Unzip your generated theme into `wordpress/themes/`
2. In WordPress, go to **Appearance → Themes**
3. Your theme will appear — click **Activate**

To stop WordPress:

```bash
docker compose down
```

To stop and wipe all data:

```bash
docker compose down -v
```

## Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run build  # type-check + build
```

## Architecture

- **Frontend:** React + TypeScript + Vite + Tailwind CSS — guided brief builder UI with in-app theme preview
- **Backend:** Python + FastAPI — AI orchestration, theme validation, ZIP packaging
- **AI:** Gemini 2.5 Flash (primary), Anthropic Claude (fallback), OpenAI gpt-4o-mini (color extraction). Provider-agnostic design via an abstract `AIProvider` interface.

### How a Theme Gets Generated

```
User brief (description, colors, typography, layout)
  │
  ├─ Input sanitization (strip HTML, generate slug)
  │
  ├─ Color extraction (optional: AI infers palette from description)
  │
  ├─ Prompt construction
  │    System prompt defines 5 design archetypes (Editorial, Bold SaaS,
  │    Portfolio, Warm & Approachable, Clean Professional) with voice,
  │    visual direction, and section rules for each.
  │
  ├─ AI call → returns design specification JSON
  │    Design tokens (colors, fonts) + all copy (hero, features, CTA,
  │    footer, about page, sample post, 404). NOT block markup.
  │
  ├─ Design spec validation
  │    Required keys, valid hex colors, minimum content counts.
  │
  ├─ Template-based theme assembly (theme_builder.py)
  │    Deterministic templates produce valid block markup from design
  │    tokens. Archetype determines section order and which extra
  │    patterns (stats, pull quote, testimonial, bio) are included.
  │    Outputs: style.css, theme.json, functions.php, templates/*,
  │    parts/*, patterns/*
  │
  ├─ Theme file validation
  │    All required files present, theme.json parses, style.css has
  │    required headers, zero Custom HTML blocks.
  │
  ├─ ZIP packaging
  │
  └─ Response (design spec + base64 ZIP + AI quality grade)
```

The key architectural decision is that the AI never generates WordPress block markup directly. It produces a JSON design spec, and a deterministic template engine assembles that into valid block HTML. This guarantees correct markup on every run. See [docs/ADR.md](docs/ADR.md) for the full rationale.

## Project Structure

```
├── frontend/              # React/TypeScript/Vite app
│   └── src/
│       ├── components/    # Wizard steps, preview, grade display
│       └── hooks/         # Wizard state management
├── backend/               # FastAPI app
│   ├── app/
│   │   ├── main.py        # API endpoints
│   │   ├── ai_provider.py # Provider abstraction (Gemini, Anthropic, OpenAI)
│   │   ├── prompt.py      # System/user prompt construction
│   │   ├── validator.py   # Design spec + theme file validation
│   │   ├── theme_builder.py # Template-based theme assembly
│   │   ├── packager.py    # ZIP packaging
│   │   ├── sanitize.py    # Input sanitization
│   │   ├── color_extractor.py # AI color palette extraction
│   │   └── grader.py      # AI quality grading
│   └── tests/             # pytest suite
├── wordpress/             # Docker WordPress for testing themes
│   └── docker-compose.yml
└── docs/
    ├── ADR.md             # Architectural decision record
    └── WHAT-NEXT.md       # Future priorities and scaling plans
```

## Known Limitations

- **One layout skeleton per section type.** Every theme shares the same structural bones (hero → archetype sections → CTA → footer). Visual variety comes from colors, fonts, and copy — not layout.
- **Five fonts only.** Heading and body fonts are constrained to Montserrat, Schibsted Grotesk, Karla, DM Sans, and Open Sans to guarantee correct Google Fonts loading.
- **No Query Loop blocks.** Generated themes don't use `wp:query` for dynamic post listings. The index and single templates use basic post content blocks.
- **No retry on AI failure.** If the AI returns invalid JSON, the error surfaces to the user immediately rather than retrying with a corrected prompt.
- **No rate limiting.** The `/api/generate` endpoint has no per-IP or per-session throttling.
- **Fonts loaded from Google Fonts CDN.** If Google Fonts is unavailable, theme typography falls back to system fonts.
- **Early commits went directly to main** rather than through pull requests. Remaining work uses feature branches and PRs.
