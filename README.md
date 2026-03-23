# AI-Powered WordPress Block Theme Generator

A web application that generates complete, installable WordPress Block Themes from a guided user brief. Built with React/TypeScript (frontend) and Python/FastAPI (backend), powered by OpenAI GPT-4o.

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- An OpenAI API key

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your OPENAI_API_KEY
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:8000`.

## Architecture

- **Frontend:** React + TypeScript + Vite + Tailwind CSS — guided brief builder UI
- **Backend:** Python + FastAPI — AI orchestration, theme validation, ZIP packaging
- **AI:** OpenAI GPT-4o (provider-agnostic design)

## Project Structure

```
├── frontend/          # React/TypeScript/Vite app
│   └── src/
├── backend/           # FastAPI app
│   ├── app/           # Application code
│   └── tests/         # Backend tests
```
