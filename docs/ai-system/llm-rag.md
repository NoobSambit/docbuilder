# LLM & RAG Integration

For complete LLM and RAG details, see:
- [DOCUMENTATION.md - LLM Integration](../../DOCUMENTATION.md#llm-integration--langchain)
- [DOCUMENTATION.md - RAG System](../../DOCUMENTATION.md#rag-system-deep-dive)
- [RAG_FEATURE.md](../../RAG_FEATURE.md)

## Quick Summary

### LLM Integration (LangChain)
- Uses Google Gemini 2.0 Flash
- LangChain chains: `Prompt | LLM | Parser`
- Pydantic validation for structured outputs
- SQLite caching for cost reduction

### RAG System
- Google Custom Search for web research
- FAISS for vector similarity search
- HuggingFace embeddings (sentence-transformers)
- Real-time knowledge enhancement

### Why RAG > Direct LLM
| Aspect | Direct LLM | RAG System |
|--------|-----------|------------|
| Knowledge | Training cutoff | Real-time web data |
| Accuracy | May hallucinate | Grounded in sources |
| Citations | None | URLs provided |

[← Back to Documentation Home](../README.md)
