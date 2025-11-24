# 🔧 Backend Architecture

The backend is the brain of DocBuilder, responsible for API handling, AI orchestration, and data management.

## Core Components

### 1. FastAPI Application (`app/main.py`)
The entry point of the application. It configures:
- **CORS Middleware**: Allows requests from the frontend.
- **Routes**: Includes routers from `app.api.endpoints`.
- **Exception Handlers**: Global error handling.

### 2. API Endpoints (`app/api/endpoints.py`)
RESTful endpoints organized by resource:
- **Auth**: `/auth/register`, `/auth/profile`
- **Projects**: `/projects`, `/projects/{id}`
- **Sections**: `/projects/{id}/sections`
- **Generation**: `/projects/{id}/generate`, `/projects/{id}/suggest-outline`
- **Refinement**: `/projects/{id}/units/{unit_id}/refine`

### 3. LLM Adapter (`app/core/llm.py`)
This is the abstraction layer for AI interactions.
- **`LLMAdapter` (Abstract Base Class)**: Defines the interface.
- **`GeminiLLMAdapter`**: Implementation using Google's Gemini 2.0 Flash.
- **`MockLLMAdapter`**: For testing without API costs.

**Key Responsibilities**:
- Constructing prompts.
- Invoking LangChain chains.
- Parsing outputs using Pydantic schemas.

### 4. RAG Service (`app/core/rag.py`)
Handles the Retrieval-Augmented Generation pipeline.
- **`WebSearchRetriever`**: Singleton class.
- **`formulate_search_query`**: Converts section titles to search queries.
- **`search_and_retrieve`**: Uses Google Custom Search API.
- **`get_relevant_context`**: Orchestrates the full RAG flow (Search -> Split -> Embed -> Retrieve).

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── endpoints.py    # API Routes
│   ├── core/
│   │   ├── auth.py         # Firebase Auth verification
│   │   ├── llm.py          # LLM Adapter & LangChain
│   │   └── rag.py          # RAG Implementation
│   ├── db/
│   │   └── firestore.py    # Database connection
│   ├── models.py           # Pydantic Data Models
│   └── main.py             # App Entry Point
├── requirements.txt        # Dependencies
└── .env                    # Environment Variables
```

## Key Technologies

- **FastAPI**: For high-performance async API.
- **LangChain**: For managing LLM interactions and chains.
- **Firebase Admin SDK**: For server-side authentication and database access.
- **FAISS**: For efficient vector similarity search.
- **HuggingFace Embeddings**: `all-MiniLM-L6-v2` for generating text embeddings.
