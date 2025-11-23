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

The backend requires Google Cloud credentials for the Gemini LLM and general server configuration.

### File Location
`backend/.env`

### Variables
| Variable | Description | Default | How to Obtain |
| :--- | :--- | :--- | :--- |
| `PORT` | Server Port | `8000` | N/A |
| `LLM_PROVIDER` | AI Provider (`mock` or `gemini`) | `mock` | Set to `gemini` to use real AI |
| `GOOGLE_API_KEY` | Gemini API Key | | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Service Account JSON | | Google Cloud Console -> IAM & Admin -> Service Accounts |

### Steps to Enable Real AI (Gemini)

1. **Get Google API Key**:
    - Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Create a new API key.
    - Paste it into `backend/.env` as `GOOGLE_API_KEY`.

2. **Get Service Account Credentials** (Optional, depending on specific Google Cloud usage beyond just API key):
    - Go to [Google Cloud Console](https://console.cloud.google.com/).
    - Navigate to **IAM & Admin** > **Service Accounts**.
    - Create a service account or select an existing one.
    - Go to the **Keys** tab -> **Add Key** -> **Create new key** -> **JSON**.
    - Save the downloaded file to a secure location (e.g., `backend/service-account.json`).
    - **IMPORTANT**: Add this file to `.gitignore`!
    - Update `GOOGLE_APPLICATION_CREDENTIALS` in `backend/.env` with the path to this file (e.g., `./service-account.json`).

3. **Activate Provider**:
    - Change `LLM_PROVIDER` to `gemini` in `backend/.env`.

### Deployment Friendly Setup (Raw JSON)

For easier deployment (e.g., to platforms where you can't easily upload files), you can use the raw JSON content directly in the environment variable.

1. **Minify JSON**: Convert your `service-account.json` content to a single line string. You can use an online tool or a simple script.
2. **Set Variable**: Paste the minified JSON string into `GOOGLE_SERVICE_ACCOUNT_JSON` in `backend/.env` (or your deployment secrets).

> [!CAUTION]
> **SECURITY WARNING**: Never commit your `.env` file or `service-account.json` to version control (git). Ensure they are in `.gitignore`. If you accidentally expose your key, revoke it immediately in the Google Cloud Console.

## Troubleshooting

- **"Cannot find module"**: Ensure you are running commands from the correct directory (`frontend` or `backend`).
- **Backend not connecting**: Check if `NEXT_PUBLIC_API_URL` in frontend matches the running backend URL.
- **Auth errors**: Verify Firebase keys are correct and Authentication is enabled in Firebase Console.
