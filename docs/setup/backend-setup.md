# Backend Setup

Step-by-step guide to set up the FastAPI backend server.

## Quick Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create `.env` file and run:
```bash
uvicorn app.main:app --reload
```

## Detailed Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

**Why Virtual Environment?**
- Isolates project dependencies
- Prevents conflicts with system Python
- Makes deployment easier

### 3. Activate Virtual Environment

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Verification:**
Your prompt should now show `(venv)` prefix.

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies Installed:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `firebase-admin` - Firebase SDK
- `google-generativeai` - Gemini AI SDK
- `python-dotenv` - Environment variables
- `python-docx` - DOCX generation
- `python-pptx` - PPTX generation
- `markdown2` - Markdown processing
- `pydantic` - Data validation
- `pytest` - Testing framework

### 5. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key_here

# LLM Provider (gemini or mock)
LLM_PROVIDER=gemini

# Firebase Credentials
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json

# Optional: Server Port
PORT=8000
```

**Getting Values:**
- `GOOGLE_API_KEY`: From [Google AI Studio](https://makersuite.google.com/app/apikey)
- `FIREBASE_CREDENTIALS`: Download from Firebase Console → Project Settings → Service Accounts
- `LLM_PROVIDER`: Use `mock` for testing without API key

**Example `.env` for Development:**
```env
GOOGLE_API_KEY=AIzaSyC...
LLM_PROVIDER=gemini
FIREBASE_CREDENTIALS=./serviceAccountKey.json
```

**Example `.env` for Testing:**
```env
GOOGLE_API_KEY=dummy
LLM_PROVIDER=mock
FIREBASE_CREDENTIALS=dummy
```

### 6. Set Up Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click Settings (gear icon) → Project Settings
4. Navigate to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save the JSON file as `serviceAccountKey.json` in `backend/` directory

> [!WARNING]
> Never commit `serviceAccountKey.json` to version control! It's already in `.gitignore`.

### 7. Start the Server

```bash
uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Server URLs:**
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs` (Swagger UI)
- Health: `http://localhost:8000/health`

### 8. Verify Installation

**Test Health Endpoint:**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status":"ok"}
```

**Test API Docs:**
Open browser to `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── endpoints.py      # API routes
│   ├── core/
│   │   ├── auth.py           # Authentication
│   │   └── llm.py            # LLM adapters
│   ├── db/
│   │   └── firestore.py      # Database client
│   ├── services/
│   │   └── export_service.py # Export functionality
│   └── models.py             # Data models
├── tests/
│   └── test_endpoints.py     # Unit tests
├── main.py                   # Application entry point
├── requirements.txt          # Dependencies
├── .env                      # Environment variables (create this)
├── .env.example              # Example environment file
└── serviceAccountKey.json    # Firebase credentials (create this)
```

## Running Tests

```bash
cd backend
pytest
```

**Test Coverage:**
- Project CRUD operations
- Outline generation (mock)
- Content generation (mock)
- Refinement operations
- Export functionality

## Development Commands

### Run Server (Development)
```bash
uvicorn app.main:app --reload
```

### Run Server (Production)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Run Tests
```bash
pytest
```

### Run Tests with Coverage
```bash
pytest --cov=app tests/
```

### Install New Dependency
```bash
pip install package_name
pip freeze > requirements.txt
```

## Troubleshooting

### ModuleNotFoundError
**Cause**: Dependencies not installed
**Solution**: `pip install -r requirements.txt`

### Firebase Admin Error
**Cause**: Invalid credentials or missing file
**Solution**: 
- Verify `FIREBASE_CREDENTIALS` path
- Ensure service account JSON is valid
- Check file permissions

### Gemini API Error
**Cause**: Invalid API key or rate limit
**Solution**:
- Verify `GOOGLE_API_KEY` in `.env`
- Check API quota in Google Cloud Console
- Use `LLM_PROVIDER=mock` for testing

### Port Already in Use
**Cause**: Another process using port 8000
**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

## Next Steps

1. [Frontend Setup](frontend-setup.md) - Set up the Next.js frontend
2. [Firebase Setup](firebase-setup.md) - Configure Firebase services
3. [Development Guide](../development/backend-development.md) - Learn backend development

---

[← Back to Prerequisites](prerequisites.md) | [Next: Frontend Setup →](frontend-setup.md)
