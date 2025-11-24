# Deployment Guide

For complete deployment details, see [DOCUMENTATION.md - Deployment Guide](../../DOCUMENTATION.md#deployment-guide).

## Quick Deployment

### Backend (Railway)
1. Connect GitHub repo
2. Set root directory: `backend`
3. Configure environment variables
4. Deploy (automatic on push)

### Frontend (Vercel)
1. Connect GitHub repo  
2. Set root directory: `frontend`
3. Configure environment variables
4. Deploy (automatic on push)

## Environment Variables

### Backend
```
GOOGLE_API_KEY=<gemini_key>
GOOGLE_CSE_ID=<search_engine_id>
LLM_PROVIDER=gemini
FIREBASE_CREDENTIALS=<json_string>
CORS_ORIGINS=https://your-app.vercel.app
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FIREBASE_API_KEY=<key>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project_id>
# ... other Firebase config
```

See main documentation for detailed setup instructions.

[← Back to Documentation Home](../README.md)
