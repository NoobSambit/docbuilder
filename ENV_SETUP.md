# Environment Setup Guide

This guide explains how to set up the environment variables for the AI Document Authoring App.

## Overview

The application consists of a **Frontend** (Next.js) and a **Backend** (FastAPI). Both need specific environment variables to function correctly.

## Frontend Setup

The frontend requires Firebase configuration to handle authentication.

### File Location
`frontend/.env.local`

### Variables
| Variable | Description | How to Obtain |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Same as above |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Same as above |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket URL | Same as above |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Same as above |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Same as above |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Defaults to `http://localhost:8000` for local development |

### Steps
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (or create one).
3. Navigate to **Project Settings**.
4. Scroll down to **Your apps** and select the Web app (</> icon).
5. Copy the configuration values into `frontend/.env.local`.

---

## Backend Setup

The backend requires Groq API credentials for the LLM and general server configuration.

### File Location
`backend/.env`

### Variables
| Variable | Description | Default | How to Obtain |
| :--- | :--- | :--- | :--- |
| `PORT` | Server Port | `8000` | N/A |
| `LLM_PROVIDER` | AI Provider (`mock` or `groq`) | `mock` | Set to `groq` to use real AI |
| `GROQ_API_KEY` | Groq API Key | | [Groq Console](https://console.groq.com/) |
| `GOOGLE_CSE_ID` | Google Custom Search Engine ID (for RAG) | | [Programmable Search Engine](https://programmablesearchengine.google.com/) |

### Steps to Enable Real AI (Groq)

1. **Get Groq API Key**:
    - Visit [Groq Console](https://console.groq.com/).
    - Sign up or log in.
    - Navigate to API Keys section.
    - Create a new API key.
    - Paste it into `backend/.env` as `GROQ_API_KEY`.

2. **Activate Provider**:
    - Change `LLM_PROVIDER` to `groq` in `backend/.env`.

3. **Optional: Enable RAG (Web Research)**:
    - Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/).
    - Create a new search engine.
    - Copy the Search Engine ID.
    - Paste it into `backend/.env` as `GOOGLE_CSE_ID`.

### Model Information

The application uses **Llama 3.3 70B Versatile** via Groq, which offers:
- Ultra-fast inference (300+ tokens/second)
- Free tier available
- High-quality text generation
- Excellent performance on document generation tasks

> [!CAUTION]
> **SECURITY WARNING**: Never commit your `.env` file to version control (git). Ensure it is in `.gitignore`. If you accidentally expose your API key, revoke it immediately in the Groq Console.

## Troubleshooting

- **"Cannot find module"**: Ensure you are running commands from the correct directory (`frontend` or `backend`).
- **Backend not connecting**: Check if `NEXT_PUBLIC_API_URL` in frontend matches the running backend URL.
- **Auth errors**: Verify Firebase keys are correct and Authentication is enabled in Firebase Console.
