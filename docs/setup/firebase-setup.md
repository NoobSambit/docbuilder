# Firebase Setup

Complete guide to setting up Firebase Authentication and Firestore for the DocBuilder application.

## Overview

Firebase provides two essential services for DocBuilder:
1. **Authentication** - User sign-in and session management
2. **Firestore** - NoSQL database for project storage

## Create Firebase Project

### 1. Go to Firebase Console

Visit [Firebase Console](https://console.firebase.google.com/)

### 2. Create New Project

1. Click "Add Project" or "Create a project"
2. Enter project name (e.g., "docbuilder")
3. Click "Continue"

### 3. Google Analytics (Optional)

- **Recommended**: Disable for development
- **Production**: Enable if you want usage analytics
- Click "Continue"

### 4. Wait for Project Creation

Firebase will create your project (takes ~30 seconds)

## Enable Authentication

### 1. Navigate to Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get Started"

### 2. Enable Email/Password

1. Click "Sign-in method" tab
2. Click "Email/Password"
3. Toggle "Enable"
4. Click "Save"

### 3. Enable Google Sign-In (Optional)

1. Click "Google" in sign-in providers
2. Toggle "Enable"
3. Enter project support email
4. Click "Save"

### 4. Configure Authorized Domains

1. Click "Settings" tab
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (already added)
   - Your production domain (e.g., `docbuilder.vercel.app`)

## Set Up Firestore

### 1. Navigate to Firestore

1. Click "Firestore Database" in left sidebar
2. Click "Create database"

### 2. Choose Security Rules

**For Development:**
- Select "Start in test mode"
- Click "Next"

**For Production:**
- Select "Start in production mode"
- You'll configure rules later

### 3. Select Location

1. Choose a location close to your users
2. **Note**: Cannot be changed later
3. Click "Enable"

### 4. Configure Security Rules

**Development Rules** (Allow all access):
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

**Production Rules** (Secure access):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection
    match /projects/{projectId} {
      // Users can only read/write their own projects
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.owner_uid;
      // Allow create if authenticated
      allow create: if request.auth != null;
    }
  }
}
```

**Apply Rules:**
1. Click "Rules" tab in Firestore
2. Paste the rules
3. Click "Publish"

## Get Firebase Configuration

### For Frontend (Web App)

1. Click Settings (gear icon) → Project Settings
2. Scroll to "Your apps" section
3. Click "Web" icon (</>)
4. Register app:
   - App nickname: "DocBuilder Web"
   - Don't check "Firebase Hosting"
   - Click "Register app"
5. Copy the configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "docbuilder-12345.firebaseapp.com",
  projectId: "docbuilder-12345",
  storageBucket: "docbuilder-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Add these values to `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=docbuilder-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=docbuilder-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=docbuilder-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### For Backend (Service Account)

1. Click Settings (gear icon) → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Click "Generate Key"
5. Save the JSON file as `serviceAccountKey.json`
6. Move file to `backend/` directory
7. Add path to `backend/.env`:

```env
FIREBASE_CREDENTIALS=./serviceAccountKey.json
```

> [!WARNING]
> Never commit `serviceAccountKey.json` to version control! Keep it secure.

## Initialize Firestore Collections

### Option 1: Automatic (First Use)

Collections are created automatically when you create your first project through the app.

### Option 2: Manual (Firebase Console)

1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `projects`
4. Add a test document:
   - Document ID: Auto-ID
   - Fields:
     - `title` (string): "Test Project"
     - `owner_uid` (string): "test_user"
     - `doc_type` (string): "docx"
     - `created_at` (timestamp): Now
5. Click "Save"
6. Delete test document after verification

## Verify Setup

### Test Authentication

1. Start frontend: `npm run dev`
2. Navigate to `http://localhost:3000/register`
3. Create a test account
4. Check Firebase Console → Authentication → Users
5. You should see the new user

### Test Firestore

1. Start backend: `uvicorn app.main:app --reload`
2. Create a project through the frontend
3. Check Firebase Console → Firestore Database
4. You should see a new document in `projects` collection

## Firestore Indexes

### Composite Indexes

For querying projects by owner and sorting:

1. Go to Firestore → Indexes tab
2. Click "Create Index"
3. Collection: `projects`
4. Fields:
   - `owner_uid` (Ascending)
   - `updated_at` (Descending)
5. Click "Create"

**Note**: Firebase will prompt you to create indexes when needed through error messages.

## Security Best Practices

### Service Account Security

1. **Never commit** `serviceAccountKey.json` to Git
2. **Restrict permissions** to minimum required
3. **Rotate keys** periodically
4. **Use environment variables** in production

### Firestore Rules

1. **Always require authentication** for read/write
2. **Validate data** in security rules
3. **Test rules** using Firebase Console simulator
4. **Monitor usage** in Firebase Console

### Authentication

1. **Enable email verification** for production
2. **Set password requirements** in Firebase Console
3. **Enable multi-factor authentication** for sensitive apps
4. **Monitor suspicious activity** in Firebase Console

## Troubleshooting

### Authentication Errors

**Error**: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Verify `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`

**Error**: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add domain to Authorized domains in Firebase Console

### Firestore Errors

**Error**: "Missing or insufficient permissions"
**Solution**: Check Firestore security rules allow the operation

**Error**: "PERMISSION_DENIED: Missing or insufficient permissions"
**Solution**: Ensure user is authenticated and owns the resource

### Service Account Errors

**Error**: "Could not load the default credentials"
**Solution**: Verify `FIREBASE_CREDENTIALS` path in `backend/.env`

**Error**: "Service account does not have required permissions"
**Solution**: Ensure service account has "Firebase Admin SDK Administrator Service Agent" role

## Cost Considerations

### Free Tier Limits

**Authentication:**
- Unlimited users
- 10,000 verifications/month (phone auth)

**Firestore:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**Typical Usage:**
- Small team (5 users): Well within free tier
- Medium usage (50 users): May exceed free tier
- Monitor usage in Firebase Console

## Next Steps

1. [Getting Started](../getting-started.md) - Run the application
2. [Development Guide](../development/project-structure.md) - Start developing
3. [Deployment](../deployment/overview.md) - Deploy to production

---

[← Back to Frontend Setup](frontend-setup.md) | [Back to Documentation Home](../README.md)
