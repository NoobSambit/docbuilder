# Troubleshooting Guide

Common issues and solutions for the DocBuilder application.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Firebase Issues](#firebase-issues)
- [AI/LLM Issues](#aillm-issues)
- [Export Issues](#export-issues)
- [Deployment Issues](#deployment-issues)

## Installation Issues

### Python Version Error

**Error**: `Python 3.9+ required`

**Solution:**
```bash
# Check Python version
python --version

# Install Python 3.9+ from python.org
# Or use package manager:
# Windows: winget install Python.Python.3.11
# Mac: brew install python@3.11
# Linux: sudo apt install python3.11
```

### Node.js Version Error

**Error**: `Node.js 18+ required`

**Solution:**
```bash
# Check Node.js version
node --version

# Install Node.js 18+ from nodejs.org
# Or use nvm:
nvm install 18
nvm use 18
```

### pip install fails

**Error**: `ERROR: Could not install packages`

**Solution:**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Clear cache and retry
pip cache purge
pip install -r requirements.txt
```

### npm install fails

**Error**: `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Backend Issues

### Server Won't Start

**Error**: `Address already in use`

**Solution:**
```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux - Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn app.main:app --port 8001
```

### Firebase Admin SDK Error

**Error**: `Could not load the default credentials`

**Solution:**
1. Verify `FIREBASE_CREDENTIALS` path in `.env`
2. Ensure `serviceAccountKey.json` exists
3. Check file permissions
4. Try absolute path instead of relative

```env
# Use absolute path
FIREBASE_CREDENTIALS=C:/Users/username/docbuilder/backend/serviceAccountKey.json
```

### Gemini API Error

**Error**: `Invalid API key`

**Solution:**
1. Verify `GOOGLE_API_KEY` in `.env`
2. Check API key is active in Google Cloud Console
3. Ensure billing is enabled (if using paid tier)
4. Try regenerating API key

**Error**: `Resource exhausted`

**Solution:**
- You've hit rate limits
- Wait a few minutes
- Upgrade to paid tier
- Use `LLM_PROVIDER=mock` for testing

### Import Errors

**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution:**
```bash
# Ensure you're in backend directory
cd backend

# Ensure virtual environment is activated
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Check `main.py` CORS configuration
2. Add your frontend URL to `origins` list:

```python
origins = [
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
]
```

## Frontend Issues

### Page Won't Load

**Error**: Blank page or loading forever

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check `NEXT_PUBLIC_API_URL` in `.env.local`
4. Clear browser cache
5. Try incognito mode

### Firebase Not Initialized

**Error**: `Firebase: No Firebase App '[DEFAULT]' has been created`

**Solution:**
1. Verify all `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`
2. Restart dev server after changing `.env.local`
3. Check Firebase config in `src/lib/firebase.ts`

### Authentication Fails

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution:**
1. Verify `NEXT_PUBLIC_FIREBASE_API_KEY`
2. Check API key in Firebase Console
3. Ensure Firebase project is active

**Error**: `Firebase: Error (auth/unauthorized-domain)`

**Solution:**
1. Go to Firebase Console → Authentication → Settings
2. Add domain to "Authorized domains"
3. For localhost, it should already be there

### API Calls Fail

**Error**: `Network Error` or `Failed to fetch`

**Solution:**
1. Ensure backend is running on correct port
2. Check `NEXT_PUBLIC_API_URL` matches backend URL
3. Verify CORS is configured in backend
4. Check browser network tab for details

### Build Errors

**Error**: `Type error: ...`

**Solution:**
```bash
# Run TypeScript check
npm run lint

# Fix errors or add type assertions
# Delete .next folder
rm -rf .next

# Rebuild
npm run build
```

## Firebase Issues

### Permission Denied

**Error**: `PERMISSION_DENIED: Missing or insufficient permissions`

**Solution:**
1. Check Firestore security rules
2. Ensure user is authenticated
3. Verify user owns the resource
4. Check rules in Firebase Console → Firestore → Rules

**Development Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Quota Exceeded

**Error**: `Quota exceeded`

**Solution:**
1. Check usage in Firebase Console
2. Upgrade to Blaze plan if needed
3. Optimize queries to reduce reads
4. Implement caching

### Service Account Issues

**Error**: `Service account does not have required permissions`

**Solution:**
1. Go to Google Cloud Console
2. IAM & Admin → Service Accounts
3. Find your service account
4. Add role: "Firebase Admin SDK Administrator Service Agent"

## AI/LLM Issues

### Outline Generation Fails

**Error**: `Invalid JSON from LLM`

**Solution:**
1. Check Gemini API key is valid
2. Try again (API may have temporary issues)
3. Use `LLM_PROVIDER=mock` for testing
4. Check backend logs for full error

### Content Generation Slow

**Symptom**: Takes >10 seconds

**Solution:**
- Normal for large word counts
- Gemini API can be slow sometimes
- Check internet connection
- Consider reducing word count

### Refinement Doesn't Work

**Symptom**: Content doesn't change or gets worse

**Solution:**
1. Be more specific in instructions
2. Check refinement history for context
3. Try regenerating section if too many refinements
4. Review diff summary to understand changes

## Export Issues

### Export Fails

**Error**: `Export failed` or no download

**Solution:**
1. Ensure project has content
2. Check browser allows downloads
3. Try different browser
4. Check backend logs for errors

### Formatting Issues

**Symptom**: Content looks wrong in Word/PowerPoint

**Solution:**
1. Open in latest Office version
2. Manually adjust formatting
3. Check for markdown syntax issues in content
4. Report issue for future fixes

### Missing Content

**Symptom**: Sections missing in exported file

**Solution:**
1. Verify sections have content in app
2. Check section status is "done"
3. Refresh project before export
4. Try exporting again

## Deployment Issues

### Vercel Build Fails

**Error**: Build fails during deployment

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Test build locally: `npm run build`
4. Fix TypeScript/lint errors

### Backend Deployment Fails

**Error**: Deployment fails on Render/Railway

**Solution:**
1. Check build logs
2. Verify `requirements.txt` is correct
3. Ensure start command is correct:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Check environment variables are set

### Environment Variables Not Working

**Symptom**: App works locally but not in production

**Solution:**
1. Verify all environment variables are set in platform
2. Check variable names match exactly
3. Restart deployment after adding variables
4. Check for typos in variable names

## Getting Help

If you can't resolve your issue:

1. **Check Logs**:
   - Backend: Console output or platform logs
   - Frontend: Browser console (F12)
   - Firebase: Firebase Console → Usage/Logs

2. **Search Issues**:
   - Check GitHub Issues
   - Search error message online

3. **Create Issue**:
   - Go to GitHub repository
   - Click "Issues" → "New Issue"
   - Provide:
     - Error message
     - Steps to reproduce
     - Environment (OS, versions)
     - Logs/screenshots

4. **Community**:
   - Stack Overflow (tag: docbuilder)
   - Discord/Slack (if available)

## Debugging Tips

### Enable Debug Logging

**Backend:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
```typescript
console.log('Debug:', variable);
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reproduce issue
4. Check failed requests
5. Inspect request/response

### Test API Directly

Use curl or Postman to test backend:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test with authentication
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/projects
```

---

[← Back to Documentation Home](README.md)
