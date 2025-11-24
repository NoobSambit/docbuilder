# Outline Generation Feature

For complete feature details, see [DOCUMENTATION.md - Core Features](../../DOCUMENTATION.md#core-features).

## Overview

AI-powered outline generation creates professional document structures based on topic and document type.

## Key Features
- Document-type awareness (DOCX vs PPTX)
- 5-8 section suggestions
- Appropriate word counts
- Deduplication with existing sections

## How It Works

1. User provides topic (e.g., "Electric Vehicle Market Analysis")
2. LangChain executes: `Prompt | Gemini | Pydantic Parser`
3. LLM generates structured outline
4. Output validated against Pydantic schema
5. Sections returned to frontend

## API Usage

```bash
POST /projects/{id}/suggest-outline
{
  "topic": "Your Document Topic"
}
```

See [API Reference](../api/endpoints.md) for more details.

[← Back to Documentation Home](../README.md)
