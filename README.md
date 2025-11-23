# AI Document Authoring App

A full-stack application for AI-assisted document creation, refinement, and export.

## Features
- **AI Outline Generation**: Suggests structured outlines based on a topic.
- **Content Generation**: Generates section content using LLMs (Gemini 2.0 Flash).
- **Smart Refinement**: Context-aware content refinement with history.
- **Rich Content Generation**: Support for bullet points and structured formatting.
- **History & Collaboration**: Tracks refinement history, supports comments and likes/dislikes.
- **Export**: Download projects as DOCX or PPTX with improved formatting.

## Tech Stack
- **Frontend**: Next.js, React, TailwindCSS (via CDN/utility classes)
- **Backend**: FastAPI, Python 3.9+
- **Database**: Firebase Firestore
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Orchestration**: LangChain (Chains, Prompts, Parsers)

## Architecture

### AI Orchestration (LangChain)
The application uses LangChain to manage LLM interactions. Key patterns include:
- **LCEL Chains**: `Prompt | LLM | Parser` pipelines for clear logic flow.
- **Structured Output**: Pydantic parsers ensure valid JSON responses for outlines and content.
- **Caching**: SQLite caching reduces API costs and latency for repeated queries.


## Setup & Local Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- Firebase Project (with Firestore enabled)
- Google Cloud API Key (for Gemini)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
GOOGLE_API_KEY=your_gemini_api_key
LLM_PROVIDER=gemini
# Path to your firebase service account json
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json
```

Run the server:
```bash
uvicorn main:app --reload
```
Backend will be at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other firebase config vars
```

Run the dev server:
```bash
npm run dev
```
Frontend will be at `http://localhost:3000`.

## Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project into Vercel.
3. Set Environment Variables in Vercel Project Settings (copy from `.env.local`).
4. Deploy.

### Backend (Cloud Run / Render / Railway)
**Note**: This project uses a standard Python environment.

**Render/Railway**:
1. Connect GitHub repo.
2. Set Build Command: `pip install -r requirements.txt`
3. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables (`GOOGLE_API_KEY`, `FIREBASE_CREDENTIALS` content as JSON string or file path).

**Cloud Run**:
1. Use `gcloud run deploy` or set up a `cloudbuild.yaml`.
2. Ensure service account has Firestore permissions.

## Testing
**Backend**:
```bash
cd backend
pytest
```
