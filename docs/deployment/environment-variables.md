# Environment Variables Reference

Complete reference of all environment variables used in the DocBuilder application.

## Backend Environment Variables

Location: `backend/.env`

### Required Variables

#### `GOOGLE_API_KEY`
- **Description**: Google Gemini API key for AI content generation
- **Type**: String
- **Required**: Yes (unless using mock LLM)
- **Example**: `AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz`
- **How to get**: [Google AI Studio](https://makersuite.google.com/app/apikey)

#### `LLM_PROVIDER`
- **Description**: LLM provider to use
- **Type**: String
- **Required**: Yes
- **Values**: `"gemini"` or `"mock"`
- **Default**: `"mock"`
- **Example**: `LLM_PROVIDER=gemini`
- **Notes**: Use `"mock"` for testing without API key

#### `FIREBASE_CREDENTIALS`
- **Description**: Path to Firebase service account JSON file
- **Type**: String (file path)
- **Required**: Yes (unless using mock for testing)
- **Example**: `./serviceAccountKey.json` or `C:/path/to/serviceAccountKey.json`
- **How to get**: Firebase Console → Project Settings → Service Accounts → Generate New Private Key

### Optional Variables

#### `PORT`
- **Description**: Port number for the backend server
- **Type**: Integer
- **Required**: No
- **Default**: `8000`
- **Example**: `PORT=8080`

### Example `.env` File

**Development:**
```env
GOOGLE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
LLM_PROVIDER=gemini
FIREBASE_CREDENTIALS=./serviceAccountKey.json
PORT=8000
```

**Testing:**
```env
GOOGLE_API_KEY=dummy
LLM_PROVIDER=mock
FIREBASE_CREDENTIALS=dummy
PORT=8000
```

## Frontend Environment Variables

Location: `frontend/.env.local`

> [!IMPORTANT]
> All frontend environment variables MUST start with `NEXT_PUBLIC_` to be accessible in the browser.

### Required Variables

#### `NEXT_PUBLIC_API_URL`
- **Description**: Backend API base URL
- **Type**: String (URL)
- **Required**: Yes
- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend.onrender.com`
- **Example**: `NEXT_PUBLIC_API_URL=http://localhost:8000`

#### `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Description**: Firebase API key
- **Type**: String
- **Required**: Yes
- **Example**: `AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz`
- **How to get**: Firebase Console → Project Settings → General → Your apps → Web app

#### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Description**: Firebase authentication domain
- **Type**: String (domain)
- **Required**: Yes
- **Example**: `docbuilder-12345.firebaseapp.com`
- **How to get**: Firebase Console → Project Settings

#### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Description**: Firebase project ID
- **Type**: String
- **Required**: Yes
- **Example**: `docbuilder-12345`
- **How to get**: Firebase Console → Project Settings

#### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Description**: Firebase storage bucket
- **Type**: String (domain)
- **Required**: Yes
- **Example**: `docbuilder-12345.appspot.com`
- **How to get**: Firebase Console → Project Settings

#### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Description**: Firebase messaging sender ID
- **Type**: String (numeric)
- **Required**: Yes
- **Example**: `123456789012`
- **How to get**: Firebase Console → Project Settings

#### `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Description**: Firebase app ID
- **Type**: String
- **Required**: Yes
- **Example**: `1:123456789012:web:abc123def456`
- **How to get**: Firebase Console → Project Settings

### Example `.env.local` File

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=docbuilder-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=docbuilder-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=docbuilder-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## Deployment Environment Variables

### Vercel (Frontend)

Set in: Vercel Dashboard → Project Settings → Environment Variables

**Variables to set:**
- All `NEXT_PUBLIC_*` variables from `.env.local`
- Update `NEXT_PUBLIC_API_URL` to production backend URL

**Environment**: Production, Preview, Development

### Render/Railway (Backend)

Set in: Platform Dashboard → Environment Variables

**Variables to set:**
- `GOOGLE_API_KEY`
- `LLM_PROVIDER`
- `FIREBASE_CREDENTIALS` (as JSON string or file upload)
- `PORT` (usually auto-set by platform)

**For `FIREBASE_CREDENTIALS` as JSON string:**
```env
FIREBASE_CREDENTIALS={"type":"service_account","project_id":"..."}
```

### Cloud Run (Backend)

Set in: Cloud Run service configuration or `gcloud` command

```bash
gcloud run deploy docbuilder-api \
  --set-env-vars GOOGLE_API_KEY=your_key,LLM_PROVIDER=gemini
```

**For `FIREBASE_CREDENTIALS`:**
- Use Google Cloud service account (automatic)
- Or set as secret in Secret Manager

## Security Best Practices

### Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
serviceAccountKey.json
```

### Use Different Keys for Environments

- **Development**: Separate Firebase project and API keys
- **Staging**: Separate Firebase project and API keys
- **Production**: Separate Firebase project and API keys

### Rotate Keys Regularly

- Rotate API keys every 90 days
- Regenerate Firebase service accounts annually
- Update all deployments when rotating

### Restrict API Keys

**Google Cloud Console:**
- Restrict Gemini API key to specific IPs or referrers
- Set usage quotas

**Firebase Console:**
- Restrict API key to specific domains
- Enable App Check for additional security

## Troubleshooting

### Backend Can't Find `.env`

**Solution:**
- Ensure `.env` is in `backend/` directory
- Check file name (no extra extensions)
- Restart server after creating `.env`

### Frontend Environment Variables Not Working

**Solution:**
- Ensure variables start with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`
- Check browser console for undefined values

### Firebase Credentials Error

**Solution:**
- Verify JSON file path is correct
- Use absolute path if relative doesn't work
- Check file permissions
- Ensure JSON is valid

### Deployment Variables Not Applied

**Solution:**
- Verify variables are set in platform dashboard
- Check for typos in variable names
- Redeploy after adding variables
- Check platform logs for errors

## Environment Variable Checklist

### Before Development

- [ ] Backend `.env` created with all required variables
- [ ] Frontend `.env.local` created with all required variables
- [ ] Firebase service account JSON downloaded
- [ ] Google Gemini API key obtained
- [ ] All paths are correct

### Before Deployment

- [ ] Production Firebase project created
- [ ] Production Gemini API key obtained
- [ ] All environment variables set in deployment platform
- [ ] Backend URL updated in frontend variables
- [ ] Secrets secured (not in version control)

---

[← Back to Deployment Overview](overview.md) | [Back to Documentation Home](../README.md)
