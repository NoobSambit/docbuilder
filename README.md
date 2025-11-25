# AI Document Builder

[![Next.js](https://img.shields.io/badge/Next.js-13.4.4-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Latest-green)](https://langchain.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Enterprise-grade AI-powered document and presentation builder with RAG-enhanced content generation, context-aware refinement, and professional export capabilities.

![AI Document Builder](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

---

## 🌟 Overview

AI Document Builder is a full-stack web application that revolutionizes document creation through advanced AI technologies. By combining Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and intelligent orchestration via LangChain, it produces high-quality, structured documents and presentations with unprecedented efficiency.

### Key Highlights

- **🤖 AI-Powered Intelligence**: Google Gemini 2.0 Flash with LangChain orchestration
- **🔍 Real-Time Knowledge**: RAG system with web search for current, factual content
- **🎯 Context-Aware**: Full document awareness with adjacent section understanding
- **📊 Professional Output**: DOCX and PPTX export with 4 custom themes
- **🔐 Enterprise Security**: Firebase authentication with JWT-based authorization
- **⚡ Production-Ready**: Deployed on Railway (backend) and Vercel (frontend)

---

## 📖 Documentation

We have comprehensive technical documentation available:

### Main Documentation
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Complete technical documentation (15,000+ words)
  - System architecture deep dive
  - LLM integration with LangChain
  - RAG system implementation
  - Context-aware generation details
  - API reference
  - Security and deployment

### Structured Documentation (`docs/` directory)
- **[Documentation Home](docs/README.md)** - Documentation index
- **[System Architecture](docs/architecture/system-overview.md)** - High-level architecture
- **[AI System Deep Dive](docs/ai-system/llm-rag.md)** - LLM & RAG explained
- **[Features Overview](docs/features/outline-generation.md)** - Feature documentation
- **[API Reference](docs/api/endpoints.md)** - Complete API guide
- **[Deployment Guide](docs/deployment/deployment.md)** - Production deployment

### Quick Reference Docs
- **[RAG_FEATURE.md](RAG_FEATURE.md)** - RAG system deep dive
- **[REFINEMENT_ENHANCEMENTS.md](REFINEMENT_ENHANCEMENTS.md)** - Context-aware refinement
- **[GOOGLE_API_FIX.md](GOOGLE_API_FIX.md)** - Google Custom Search setup
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide

---

## 🚀 Features

### Core Capabilities

#### 1. **AI Outline Generation**
Generate professional document structures instantly based on your topic and document type.

- Document-type awareness (DOCX vs PPTX)
- Intelligent section suggestions (5-8 sections)
- Appropriate word count recommendations
- Deduplication with existing content

#### 2. **Content Generation with RAG**
Create high-quality content enhanced with real-time web research.

**Standard Generation**:
- Powered by Gemini 2.0 Flash
- Context-aware with full outline visibility
- Intelligent format detection (bullets vs paragraphs)
- Rich HTML formatting with markdown support

**RAG Enhancement**:
- Google Custom Search API integration
- Semantic similarity search with FAISS
- HuggingFace embeddings (sentence-transformers)
- Cited sources with traceable URLs

**Why RAG > Direct LLM**:
| Aspect | Direct LLM | RAG System |
|--------|-----------|------------|
| Knowledge | Training cutoff (Jan 2025) | Real-time web data |
| Accuracy | May hallucinate | Grounded in sources |
| Citations | None | URLs and titles |
| Currency | Fixed | Up-to-date |

#### 3. **Context-Aware Refinement**
Intelligent content refinement with unprecedented context awareness.

**Context Provided**:
- Document title, type, and total sections
- Section position with visual outline marker
- Adjacent section summaries (previous + next)
- Full content (no truncation)
- Word count intelligence (automatic ±30% adjustments)
- Refinement history with like/dislike reactions
- Summary bullets for context preservation

**Smart Features**:
```
User: "Make this longer"
System: Automatically expands to +30% (e.g., 250 → 325 words)

User: "Add transition to next section"
System: Creates smooth connection using adjacent section context

User: "Improve tone"
System: Learns from history (uses liked approaches, avoids disliked ones)
```

#### 4. **Professional Export**
Export documents with enterprise-grade formatting.

**DOCX Features**:
- Title page with metadata
- Hierarchical headings (H1-H3)
- HTML formatting preservation (bold, italic, lists)
- Professional Calibri font, proper spacing

**PPTX Features** (4 Themes):
- **Professional**: Blue/gray corporate
- **Modern**: Vibrant purple/green
- **Academic**: Traditional black/white
- **Creative**: Bold red/orange

**Slide Elements**:
- Custom backgrounds and accent colors
- Decorative elements (stripes, dividers)
- Dynamic font sizing based on content
- HTML formatting preservation
- Slide numbers and branding

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT (Next.js + React + TailwindCSS)                 │
│  - Authentication (Firebase SDK)                        │
│  - Rich Text Editor (TipTap)                           │
│  - Drag-Drop Sections (DND Kit)                        │
└─────────────────────────────────────────────────────────┘
                         │ HTTPS/REST
┌─────────────────────────────────────────────────────────┐
│  APPLICATION (FastAPI + LangChain)                      │
│  - RESTful API Endpoints                               │
│  - JWT Authentication Middleware                        │
│  - LangChain Orchestration (Prompt│LLM│Parser)        │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│  SERVICES                                               │
│  - LLM Adapter (Gemini 2.0 Flash)                     │
│  - RAG Retriever (Google Search + FAISS)              │
│  - Export Service (python-docx, python-pptx)          │
└─────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│  DATA                                                   │
│  - Firebase Firestore (NoSQL Database)                │
│  - Google Search API (Web Research)                    │
│  - FAISS (Vector Similarity Search)                   │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

**Backend**:
- Python 3.9+, FastAPI (async web framework)
- LangChain (LLM orchestration with Pydantic validation)
- Firebase Admin SDK (authentication + database)
- Google Generative AI (Gemini 2.0 Flash)
- FAISS, HuggingFace (RAG system)

**Frontend**:
- Next.js 13, React 18, TypeScript 5
- TailwindCSS 3 (utility-first styling)
- Firebase SDK 9 (client auth)7
- TipTap 2 (rich text editing)
- DND Kit 6 (drag-drop)

**Infrastructure**:
- Railway (backend hosting)
- Vercel (frontend hosting)
- Firebase Firestore (database)
- Google Cloud APIs (LLM + Search)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Firebase Project
- Google Cloud API Key (Gemini)
- Google Custom Search Engine (for RAG)

### Backend Setup

1. **Clone and navigate**:
```bash
git clone https://github.com/yourusername/docbuilder.git
cd docbuilder/backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment** (create `backend/.env`):
```bash
# LLM Configuration
GOOGLE_API_KEY=your_gemini_api_key
LLM_PROVIDER=gemini

# Firebase
FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json

# RAG Configuration (Optional but recommended)
GOOGLE_CSE_ID=your_custom_search_engine_id

# CORS (for production)
CORS_ORIGINS=http://localhost:3000
```

5. **Run backend**:
```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend**:
```bash
cd ../frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (create `frontend/.env.local`):
```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

4. **Run frontend**:
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

See **[Deployment Guide](docs/deployment/deployment.md)** for production setup.

---

## 🎯 Usage

### Quick Start

1. **Register** at `http://localhost:3000/register`
2. **Login** and create a new project
3. **Choose document type** (DOCX or PPTX)
4. **Generate outline** with AI suggestions
5. **Generate content** for each section (enable RAG for research-heavy sections)
6. **Refine content** using natural language instructions
7. **Export** to DOCX or PPTX with your preferred theme

### API Examples

**Generate Outline**:
```bash
curl -X POST http://localhost:8000/projects/{project_id}/suggest-outline \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Electric Vehicle Market Analysis"}'
```

**Generate Content with RAG**:
```bash
curl -X POST http://localhost:8000/projects/{project_id}/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "section_id": "s1",
    "use_rag": true
  }'
```

**Refine Content**:
```bash
curl -X POST http://localhost:8000/projects/{project_id}/units/{section_id}/refine \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Make this more concise and add transition to next section",
    "user_id": "user123",
    "target_word_count": 200
  }'
```

---

## 🚀 Deployment

### Backend (Railway)

1. **Connect GitHub repo** to Railway
2. **Set root directory** to `backend`
3. **Configure environment variables** (see [Deployment Guide](docs/deployment/deployment.md))
4. **Deploy** (automatic on git push)

**Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. **Connect GitHub repo** to Vercel
2. **Set root directory** to `frontend`
3. **Configure environment variables**
4. **Deploy** (automatic on git push to main)

**Production URL**: `https://your-app.vercel.app`

---

## 📊 Performance

### Benchmarks

| Operation | Time | Cost |
|-----------|------|------|
| Outline generation | 3-5 sec | $0.01 |
| Content generation (standard) | 5-8 sec | $0.02 |
| Content generation (RAG) | 15-25 sec | $0.03 |
| Refinement | 4-7 sec | $0.01 |
| Export (DOCX) | 1-2 sec | Free |
| Export (PPTX) | 2-3 sec | Free |

### Scalability

- **Backend**: Stateless design enables horizontal scaling
- **Database**: Firestore auto-scales to millions of documents
- **LLM**: Gemini handles 10 requests/second (rate limit)
- **RAG**: In-memory FAISS (can migrate to Pinecone for scale)

---

## 🔒 Security

- **Authentication**: Firebase JWT tokens with signature verification
- **Authorization**: Users can only access their own projects
- **Input Validation**: Pydantic models validate all API inputs
- **HTML Sanitization**: Bleach library prevents XSS attacks
- **CORS**: Restricted to whitelisted origins
- **Environment Variables**: Secrets stored in `.env` (never committed)

---

## 🧪 Testing

**Backend Tests**:
```bash
cd backend
pytest
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

**CI/CD**: GitHub Actions runs tests automatically on push (see `.github/workflows/ci.yml`)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines**:
- Follow PEP 8 (Python) and ESLint (TypeScript)
- Write tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**Technologies**:
- [LangChain](https://langchain.com/) - LLM orchestration framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - Large Language Model
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [Firebase](https://firebase.google.com/) - Authentication and database
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework

---

## 🗺️ Roadmap

**Upcoming Features**:
- [ ] Collaborative editing (multiple users, real-time)
- [ ] Custom knowledge base upload
- [ ] Citation display in frontend UI
- [ ] Advanced analytics dashboard
- [ ] Self-review chain (generate → critique → refine)
- [ ] Template library (business reports, academic papers, etc.)
- [ ] Version history with rollback
- [ ] Export to PDF, Markdown, HTML
- [ ] Multilingual support

**Completed**:
- [x] RAG system with web search
- [x] Context-aware refinement
- [x] Professional export themes
- [x] Refinement history with reactions

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Built with ❤️ using modern AI technologies. Production-ready and client-impressive.**
