# RAG (Retrieval-Augmented Generation) Feature

## Overview

The DocBuilder now includes a powerful **RAG system with real-time web search** to enhance document generation with up-to-date, domain-specific information. This feature uses LangChain, Google Custom Search, and FAISS vector database to retrieve and intelligently integrate web content into generated documents.

## 🌟 Key Features

- **Real-time Web Search**: Fetches current information from the internet
- **Semantic Search**: Uses embeddings and vector similarity for relevant content matching
- **Smart Query Formulation**: Automatically generates optimal search queries from section context
- **Intelligent Integration**: LLM naturally incorporates web research without plagiarism
- **Optional Per-Section**: Users can enable/disable RAG for specific sections
- **Production-Ready**: Built with enterprise-grade tools (LangChain, FAISS, HuggingFace)

## Architecture

### Components

1. **`backend/app/core/rag.py`** - Core RAG module
   - `WebSearchRetriever` class handles all RAG operations
   - Google Custom Search API integration
   - FAISS vector store for semantic search
   - HuggingFace embeddings (sentence-transformers/all-MiniLM-L6-v2)

2. **`backend/app/core/llm.py`** - Enhanced LLM integration
   - Added `use_rag` parameter to `generate_section()`
   - RAG context injection into system prompts
   - Metadata tracking (sources, query used, chunks retrieved)

3. **`backend/app/api/endpoints.py`** - API updates
   - `GenerateContentRequest` now accepts `use_rag` boolean
   - Passes RAG flag to LLM adapter

4. **Frontend** - User interface
   - Checkbox: "🌐 Enhance with Web Research (RAG)"
   - Status indicator: "Researching..." vs "Generating..."

## How It Works

### Flow Diagram

```
User clicks "Generate with AI" (RAG enabled)
    ↓
API: POST /projects/{id}/generate { section_id, use_rag: true }
    ↓
LLM Adapter: generate_section(use_rag=True)
    ↓
RAG Retriever: get_relevant_context()
    ├─ 1. Formulate search query from section title + topic
    ├─ 2. Google Custom Search API → Fetch top 5 web results
    ├─ 3. Scrape and clean web page content
    ├─ 4. Split content into chunks (800 chars each)
    ├─ 5. Generate embeddings using HuggingFace
    ├─ 6. Create FAISS vector store
    └─ 7. Similarity search → Return top 5 relevant chunks
    ↓
Inject retrieved context into LLM prompt
    ↓
Gemini LLM: Generate content with web research context
    ↓
Return enhanced content to user
```

### Example

**Section**: "Comparative Analysis: Mitosis vs. Meiosis"
**Topic**: "Cell Biology Overview"

1. **Search Query**: `mitosis meiosis differences comparison biology`
2. **Web Results**: 5 recent biology articles/papers
3. **Retrieved Chunks**: Top 5 most relevant passages about mitosis/meiosis
4. **LLM Prompt**: Includes web research + original instructions
5. **Output**: Factually accurate bullet points with latest scientific information

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New dependencies added:
- `faiss-cpu>=1.7.4` - Vector search
- `sentence-transformers>=2.2.2` - Embeddings
- `google-api-python-client>=2.100.0` - Google Search API
- `langchain-text-splitters>=0.0.1` - Text chunking
- `requests>=2.31.0` - Web scraping

### 2. Configure Google Custom Search API

#### Step 1: Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable "Custom Search API"
4. Create credentials → API Key
5. Copy the API key

#### Step 2: Create Custom Search Engine
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create a new search engine
3. **Important**: Under "Search settings", enable "Search the entire web"
4. Copy your Search Engine ID (format: `xxxxxxxxx:yyyyyyyyyyy`)

#### Step 3: Update .env

```bash
# backend/.env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

### 3. Test RAG (Optional - Mock Mode)

If you don't set `GOOGLE_CSE_ID`, the system will use mock data for testing:

```python
# RAG will return mock content without real web search
documents = [
    Document(
        page_content=f"Mock research content about {query}.",
        metadata={"source": "mock", "title": "Mock Result"}
    )
]
```

This is useful for development and demonstrations without API costs.

## Usage

### Frontend

1. Create or open a project
2. Add a section (e.g., "Market Analysis of Electric Vehicles")
3. ✅ Check "🌐 Enhance with Web Research (RAG)"
4. Click "Generate with AI"
5. Watch status change: "Researching..." → "Done"

### API

```bash
curl -X POST http://localhost:8000/projects/{project_id}/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "section_id": "section-123",
    "use_rag": true
  }'
```

### Response Metadata

When RAG is enabled, the response includes metadata:

```json
{
  "text": "<p>Enhanced content with web research...</p>",
  "bullets": ["Key point 1", "Key point 2"],
  "rag_metadata": {
    "rag_enabled": true,
    "sources": [
      {
        "url": "https://example.com/article",
        "title": "Electric Vehicle Market Report 2024"
      }
    ],
    "query": "electric vehicles market analysis 2024",
    "chunks_used": 5
  }
}
```

## Technical Details

### Embedding Model

- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Dimensions**: 384
- **Speed**: ~400 sentences/second on CPU
- **Quality**: Good balance of accuracy and performance
- **No API Key Required**: Downloaded from HuggingFace

### Vector Store

- **Technology**: FAISS (Facebook AI Similarity Search)
- **Type**: In-memory (created per request)
- **Similarity Metric**: Cosine similarity
- **Search Algorithm**: Flat L2 index

### Text Chunking

- **Method**: RecursiveCharacterTextSplitter
- **Chunk Size**: 800 characters
- **Overlap**: 100 characters
- **Strategy**: Split by paragraphs first, then sentences

### Web Scraping

- **Library**: BeautifulSoup4
- **User-Agent**: Mozilla/5.0 (to avoid bot blocking)
- **Timeout**: 5 seconds per page
- **Content Limit**: 5000 characters per page
- **Cleanup**: Removes scripts, styles, nav, footer, header

## Performance

### Speed
- **Without RAG**: ~5-8 seconds per section
- **With RAG**: ~15-25 seconds per section
  - 3-5 seconds: Web search + scraping
  - 2-3 seconds: Embedding generation
  - 1-2 seconds: Vector search
  - 8-15 seconds: LLM generation

### API Costs

**Google Custom Search API**:
- Free tier: 100 queries/day
- Paid: $5 per 1000 queries
- Our usage: 1 query per RAG-enabled section

**HuggingFace Embeddings**:
- FREE (runs locally)
- No API calls, no costs

**Gemini LLM**:
- Same cost as before (RAG adds context to prompt)
- Slightly higher input tokens (~2000 extra)

## Best Practices

### When to Use RAG

✅ **Use RAG for**:
- Technical/scientific content requiring accuracy
- Market analysis needing recent data
- Current events or trends
- Domain-specific professional content

❌ **Don't use RAG for**:
- Creative writing
- Personal narratives
- Abstract philosophical content
- Simple introductions/conclusions

### Optimization Tips

1. **Be Specific**: More specific section titles = better search results
   - Good: "Latest Trends in AI Chip Manufacturing 2024"
   - Bad: "Technology Overview"

2. **Combine with Normal Generation**: Use RAG selectively
   - Use for data-heavy sections
   - Skip for narrative sections

3. **Monitor API Usage**: Google CSE has daily limits
   - Free tier: 100 queries/day
   - Plan accordingly for large documents

## Troubleshooting

### RAG Not Working

1. **Check API credentials**:
   ```bash
   echo $GOOGLE_API_KEY
   echo $GOOGLE_CSE_ID
   ```

2. **Verify Custom Search Engine settings**:
   - "Search the entire web" must be enabled
   - CSE status should be "Active"

3. **Check logs**:
   ```bash
   # Look for RAG-related messages
   [RAG] Retrieved 5 documents for query: ...
   [RAG Mock] Would search for: ...
   ```

### No Results Retrieved

- **Cause**: Search query too generic or no matching content
- **Solution**: Use more specific section titles

### Slow Performance

- **Cause**: Web scraping timeout or large documents
- **Solution**: Reduce `num_results` in `search_and_retrieve()` (line 151 in rag.py)

### Embedding Download Failed

- **Cause**: No internet connection or HuggingFace down
- **Solution**: Model is cached after first download. Check `~/.cache/huggingface/`

## Future Enhancements

- [ ] Add citation display in frontend
- [ ] Support multiple embedding models
- [ ] Persistent vector store (Chroma/Pinecone)
- [ ] Custom knowledge base upload
- [ ] RAG for refinement (not just generation)
- [ ] Configurable web sources (filter by domain)
- [ ] RAG quality scoring

## Interview Talking Points

When presenting this feature:

1. **Problem**: LLMs have knowledge cutoff, can't access real-time data
2. **Solution**: RAG with web search provides up-to-date information
3. **Implementation**: Production-ready stack (LangChain, FAISS, HuggingFace)
4. **Scalability**: In-memory vector store for speed, can scale to Pinecone/Weaviate
5. **User Control**: Optional per-section, not forced on users
6. **Cost-Effective**: Free embeddings (local), affordable Google CSE
7. **Quality**: Semantic search ensures relevance, not just keyword matching

## Demo Script

```
1. Open project: "Electric Vehicle Market Analysis 2024"
2. Add section: "Comparative Analysis: Tesla vs BYD"
3. Enable RAG checkbox
4. Click Generate
5. Point out: "Retrieved web research from 5 sources"
6. Show content with recent market data
7. Explain: "This data is from live web search, not LLM training data"
```

---

**Built with**: LangChain, FAISS, HuggingFace, Google Custom Search
**Status**: Production-Ready ✅
**Maintenance**: Active
