# Getting Started

Get the AI Document Authoring App running on your local machine in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:
- **Python 3.9+** installed
- **Node.js 18+** installed
- **Firebase Project** with Firestore enabled
- **Google Cloud API Key** for Gemini

> [!TIP]
> For detailed prerequisites and installation instructions, see [Prerequisites](setup/prerequisites.md).

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/docbuilder.git
cd docbuilder
```

### 2. Backend Setup (5 minutes)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
LLM_PROVIDER=gemini
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup (3 minutes)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 4. Verify Installation

1. Open your browser to `http://localhost:3000`
2. Click "Register" to create a new account
3. Sign in with your credentials
4. Create a new project
5. Try generating an AI outline

## Using Mock LLM (Optional)

For testing without a Gemini API key, you can use the mock LLM adapter:

In `backend/.env`:
```env
LLM_PROVIDER=mock
FIREBASE_CREDENTIALS=dummy
```

> [!WARNING]
> Mock mode provides dummy responses and is only suitable for development and testing.

## Next Steps

Now that you have the app running:

1. **Explore Features**: Check out the [Features Documentation](features/README.md)
2. **Learn the API**: Review the [API Reference](api/README.md)
3. **Start Developing**: Read the [Development Guide](development/project-structure.md)
4. **Deploy**: Follow the [Deployment Guide](deployment/overview.md)

## Troubleshooting

### Backend won't start
- Verify Python version: `python --version` (should be 3.9+)
- Check if port 8000 is available
- Ensure `.env` file exists with correct values

### Frontend won't start
- Verify Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### Firebase authentication errors
- Verify Firebase credentials in `.env.local`
- Ensure Firestore is enabled in Firebase Console
- Check that authentication methods are enabled

For more issues, see the [Troubleshooting Guide](troubleshooting.md).

## Additional Resources

- [Demo Script](../demo_script.md) - Step-by-step demo walkthrough
- [Architecture Overview](architecture.md) - Understand the system design
- [Firebase Setup Guide](setup/firebase-setup.md) - Detailed Firebase configuration

---

[← Back to Documentation Home](README.md)
