# Prerequisites

System requirements and prerequisites for running the AI Document Authoring App.

## System Requirements

### Development Machine

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10, macOS 10.15, Ubuntu 20.04 | Latest stable version |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 2 GB free | 5 GB+ free |
| **Internet** | Required | Broadband connection |

## Required Software

### 1. Python

**Version**: 3.9 or higher

**Installation:**

**Windows:**
```bash
# Download from python.org
# Or use winget:
winget install Python.Python.3.11
```

**macOS:**
```bash
brew install python@3.11
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

**Verify Installation:**
```bash
python --version
# Should output: Python 3.9.x or higher
```

### 2. Node.js

**Version**: 18 or higher

**Installation:**

**Windows:**
```bash
# Download from nodejs.org
# Or use winget:
winget install OpenJS.NodeJS
```

**macOS:**
```bash
brew install node@18
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version
# Should output: v18.x.x or higher

npm --version
# Should output: 9.x.x or higher
```

### 3. Git

**Version**: Any recent version

**Installation:**

**Windows:**
```bash
winget install Git.Git
```

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git
```

**Verify Installation:**
```bash
git --version
```

## Required Accounts & Services

### 1. Firebase Project

**Purpose**: Authentication and Firestore database

**Setup Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name
4. Disable Google Analytics (optional)
5. Click "Create Project"

**Required Services:**
- ✅ Authentication (Email/Password, Google)
- ✅ Firestore Database
- ❌ Hosting (optional)
- ❌ Functions (not used)

**Detailed Setup**: See [Firebase Setup Guide](firebase-setup.md)

### 2. Google Cloud API Key

**Purpose**: Access to Gemini AI for content generation

**Setup Steps:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project (or create new)
4. Copy the API key
5. Store securely (will be used in `.env` file)

**Pricing:**
- Free tier: 60 requests per minute
- Paid tier: Higher limits available

**Alternative**: Use mock LLM adapter for development (no API key needed)

## Optional Tools

### Code Editor

**Recommended**: Visual Studio Code

**Installation:**
```bash
# Windows
winget install Microsoft.VisualStudioCode

# macOS
brew install --cask visual-studio-code

# Linux
sudo snap install code --classic
```

**Useful Extensions:**
- Python
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### Database Viewer

**Recommended**: Firestore Emulator or Firebase Console

**Installation:**
```bash
npm install -g firebase-tools
firebase login
```

### API Testing

**Recommended**: Postman or Thunder Client (VS Code extension)

## Environment Setup Checklist

Before proceeding with installation:

- [ ] Python 3.9+ installed and in PATH
- [ ] Node.js 18+ installed and in PATH
- [ ] Git installed
- [ ] Firebase project created
- [ ] Firestore enabled in Firebase project
- [ ] Authentication enabled in Firebase project
- [ ] Google Cloud API key obtained (or planning to use mock adapter)
- [ ] Code editor installed
- [ ] Terminal/command prompt ready

## Verification Script

Run this script to verify all prerequisites:

**Windows (PowerShell):**
```powershell
Write-Host "Checking prerequisites..."
python --version
node --version
npm --version
git --version
Write-Host "All checks complete!"
```

**macOS/Linux (Bash):**
```bash
#!/bin/bash
echo "Checking prerequisites..."
python3 --version
node --version
npm --version
git --version
echo "All checks complete!"
```

## Troubleshooting

### Python not found
- Ensure Python is installed
- Add Python to PATH
- Restart terminal after installation

### Node.js not found
- Ensure Node.js is installed
- Add Node.js to PATH
- Restart terminal after installation

### Permission errors (Linux/macOS)
- Use `sudo` for system-wide installations
- Or use version managers (pyenv, nvm)

## Next Steps

Once all prerequisites are met:

1. [Backend Setup](backend-setup.md) - Install backend dependencies
2. [Frontend Setup](frontend-setup.md) - Install frontend dependencies
3. [Firebase Setup](firebase-setup.md) - Configure Firebase services

---

[← Back to Documentation Home](../README.md) | [Next: Backend Setup →](backend-setup.md)
