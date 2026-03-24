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

- **Frontend:** React + TypeScript + Vite + Tailwind CSS — guided brief builder UI
- **Backend:** Python + FastAPI — AI orchestration, theme validation, ZIP packaging
- **AI:** Anthropic Claude (provider-agnostic design)

## Project Structure

```
├── frontend/          # React/TypeScript/Vite app
│   └── src/
├── backend/           # FastAPI app
│   ├── app/           # Application code
│   └── tests/         # Backend tests
├── wordpress/         # Docker WordPress for testing themes
│   ├── docker-compose.yml
│   └── themes/        # Unzip generated themes here
```
