# Project Structure

Overview of the DocBuilder codebase organization.

## Repository Structure

```
docbuilder/
├── backend/                 # FastAPI backend
├── frontend/                # Next.js frontend
├── docs/                    # Documentation (this folder)
├── .github/                 # GitHub Actions workflows
├── README.md                # Project overview
├── demo_script.md           # Demo walkthrough
└── .gitignore               # Git ignore rules
```

## Backend Structure

```
backend/
├── app/
│   ├── api/
│   │   └── endpoints.py           # All API routes
│   ├── core/
│   │   ├── auth.py                # Authentication middleware
│   │   └── llm.py                 # LLM adapter interface & implementations
│   ├── db/
│   │   └── firestore.py           # Firestore database client
│   ├── services/
│   │   └── export_service.py      # DOCX/PPTX export logic
│   └── models.py                  # Pydantic data models
├── tests/
│   └── test_endpoints.py          # Unit tests
├── main.py                        # Application entry point
├── requirements.txt               # Python dependencies
├── .env                           # Environment variables (create this)
├── .env.example                   # Example environment file
└── serviceAccountKey.json         # Firebase credentials (create this)
```

### Key Backend Files

**`main.py`**
- FastAPI application initialization
- CORS middleware configuration
- Router inclusion
- Health check endpoint

**`app/api/endpoints.py`**
- All API route definitions
- Request/response handling
- Business logic orchestration

**`app/core/auth.py`**
- Firebase token verification
- User authentication dependency
- Mock token support for testing

**`app/core/llm.py`**
- LLM adapter interface (ABC)
- MockLLMAdapter for testing
- GeminiLLMAdapter for production
- Prompt engineering logic

**`app/models.py`**
- Pydantic models for data validation
- Project, Section, Refinement, Comment models
- Request/response schemas

**`app/services/export_service.py`**
- DOCX generation with python-docx
- PPTX generation with python-pptx
- Markdown to text conversion

**`app/db/firestore.py`**
- Firestore client initialization
- Database connection management

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx             # Page layout wrapper
│   │   └── ProjectCard.tsx        # Project card component
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state management
│   ├── lib/
│   │   └── firebase.ts            # Firebase SDK initialization
│   ├── pages/
│   │   ├── _app.tsx               # Next.js app wrapper
│   │   ├── index.tsx              # Landing/home page
│   │   ├── login.tsx              # Login page
│   │   ├── register.tsx           # Registration page
│   │   ├── dashboard.tsx          # User dashboard
│   │   └── projects/
│   │       ├── new.tsx            # Create new project
│   │       └── [id].tsx           # Project detail page
│   └── styles/
│       └── globals.css            # Global CSS styles
├── public/                        # Static assets
├── __tests__/
│   └── index.test.tsx             # Unit tests
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Example environment file
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Node.js dependencies
└── jest.config.js                 # Jest test configuration
```

### Key Frontend Files

**`src/pages/_app.tsx`**
- Global app wrapper
- AuthContext provider
- Global styles import

**`src/context/AuthContext.tsx`**
- Firebase authentication state
- Login/logout functions
- User session management

**`src/lib/firebase.ts`**
- Firebase SDK initialization
- Firebase config from environment variables

**`src/pages/dashboard.tsx`**
- User project list
- Create new project button
- Project cards display

**`src/pages/projects/[id].tsx`**
- Project detail view
- Outline display
- Content generation UI
- Refinement interface
- Export functionality

## Configuration Files

### Backend Configuration

**`requirements.txt`**
```
fastapi
uvicorn
firebase-admin
google-generativeai
python-dotenv
python-docx
python-pptx
markdown2
pydantic
pytest
```

**`.env.example`**
```env
GOOGLE_API_KEY=your_api_key_here
LLM_PROVIDER=gemini
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json
```

### Frontend Configuration

**`package.json`**
- Dependencies: Next.js, React, Firebase, Axios, Tailwind
- Scripts: dev, build, start, test, lint

**`next.config.js`**
```javascript
module.exports = {
  reactStrictMode: true,
}
```

**`tailwind.config.js`**
- Tailwind CSS configuration
- Custom theme settings
- Plugin configuration

**`tsconfig.json`**
- TypeScript compiler options
- Path aliases
- Module resolution

## Data Flow

### Project Creation Flow

```
User → Frontend (dashboard.tsx)
     → API POST /projects
     → Backend (endpoints.py)
     → Firestore (create document)
     → Response to Frontend
     → Update UI
```

### Content Generation Flow

```
User → Frontend (projects/[id].tsx)
     → API POST /projects/{id}/generate
     → Backend (endpoints.py)
     → LLM Adapter (llm.py)
     → Gemini API
     → Parse response
     → Firestore (update section)
     → Response to Frontend
     → Update UI
```

## Naming Conventions

### Backend

- **Files**: `snake_case.py`
- **Classes**: `PascalCase`
- **Functions**: `snake_case`
- **Variables**: `snake_case`
- **Constants**: `UPPER_SNAKE_CASE`

### Frontend

- **Files**: `PascalCase.tsx` (components), `kebab-case.tsx` (pages)
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`

## Import Organization

### Backend

```python
# Standard library
import os
from typing import List

# Third-party
from fastapi import FastAPI
from pydantic import BaseModel

# Local
from app.models import Project
from app.core.auth import get_current_user
```

### Frontend

```typescript
// React
import { useState, useEffect } from 'react';

// Next.js
import { useRouter } from 'next/router';

// Third-party
import axios from 'axios';

// Local
import { auth } from '@/lib/firebase';
import Layout from '@/components/Layout';
```

## Testing Structure

### Backend Tests

```
tests/
└── test_endpoints.py
    ├── test_health_check()
    ├── test_create_project()
    ├── test_list_projects()
    ├── test_suggest_outline()
    ├── test_generate_content()
    └── test_export()
```

### Frontend Tests

```
__tests__/
└── index.test.tsx
    └── renders homepage
```

## Environment Variables

### Backend

- `GOOGLE_API_KEY` - Gemini API key
- `LLM_PROVIDER` - "gemini" or "mock"
- `FIREBASE_CREDENTIALS` - Path to service account JSON
- `PORT` - Server port (optional, default 8000)

### Frontend

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (7 variables)

## Related Documentation

- [Backend Development](backend-development.md)
- [Frontend Development](frontend-development.md)
- [Testing Guide](testing.md)

---

[← Back to Documentation Home](../README.md) | [Next: Backend Development →](backend-development.md)
