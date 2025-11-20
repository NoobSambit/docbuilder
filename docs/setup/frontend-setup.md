# Frontend Setup

Step-by-step guide to set up the Next.js frontend application.

## Quick Setup

```bash
cd frontend
npm install
```

Create `.env.local` file and run:
```bash
npm run dev
```

## Detailed Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

**Dependencies Installed:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `firebase` - Firebase SDK
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `typescript` - Type safety
- `jest` - Testing framework

**Installation Time:** 2-5 minutes depending on internet speed

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Getting Firebase Config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click Settings (gear icon) → Project Settings
4. Scroll to "Your apps" section
5. Click "Web" icon (</>) to add web app
6. Copy the config values

**Example `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=docbuilder-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=docbuilder-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=docbuilder-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

> [!IMPORTANT]
> All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 4. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

**Application URLs:**
- Frontend: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Dashboard: `http://localhost:3000/dashboard`

### 5. Verify Installation

**Open Browser:**
Navigate to `http://localhost:3000`

**Expected Result:**
- Login/Register page loads
- No console errors
- Firebase initializes successfully

**Test Registration:**
1. Click "Register"
2. Enter email and password
3. Submit form
4. Should redirect to dashboard

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Page layout
│   │   └── ProjectCard.tsx    # Project card component
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   └── firebase.ts        # Firebase configuration
│   ├── pages/
│   │   ├── _app.tsx           # App wrapper
│   │   ├── index.tsx          # Home/landing page
│   │   ├── login.tsx          # Login page
│   │   ├── register.tsx       # Register page
│   │   ├── dashboard.tsx      # Dashboard
│   │   └── projects/
│   │       ├── new.tsx        # Create project
│   │       └── [id].tsx       # Project detail
│   └── styles/
│       └── globals.css        # Global styles
├── __tests__/
│   └── index.test.tsx         # Unit tests
├── public/                    # Static assets
├── .env.local                 # Environment variables (create this)
├── .env.example               # Example environment file
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── jest.config.js             # Jest configuration
```

## Development Commands

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### Module Not Found
**Cause**: Dependencies not installed
**Solution**: `npm install`

### Firebase Not Initialized
**Cause**: Missing or incorrect environment variables
**Solution**:
- Verify `.env.local` exists
- Check all `NEXT_PUBLIC_FIREBASE_*` variables
- Restart dev server after changing `.env.local`

### Port 3000 Already in Use
**Cause**: Another process using port 3000
**Solution**:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### API Connection Failed
**Cause**: Backend not running or wrong URL
**Solution**:
- Ensure backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

### Build Errors
**Cause**: TypeScript errors or missing dependencies
**Solution**:
- Run `npm run lint` to find errors
- Fix TypeScript errors
- Delete `.next` folder and rebuild

## Next Steps

1. [Firebase Setup](firebase-setup.md) - Configure Firebase services
2. [Development Guide](../development/frontend-development.md) - Learn frontend development
3. [Deployment](../deployment/frontend-deployment.md) - Deploy to Vercel

---

[← Back to Backend Setup](backend-setup.md) | [Next: Firebase Setup →](firebase-setup.md)
