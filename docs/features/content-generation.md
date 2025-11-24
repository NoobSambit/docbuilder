# ✍️ Content Generation

DocBuilder offers two powerful modes for generating content: **Standard Generation** and **RAG-Enhanced Generation**.

## 1. Standard Generation

Fast, creative, and context-aware writing powered by Gemini 2.0 Flash.

### Context Awareness
Unlike simple chatbots, DocBuilder provides the LLM with a "360-degree view" of your document:
- **Document Context**: Title, type, and full outline.
- **Position Awareness**: "You are writing Section 3 of 8".
- **Adjacent Sections**: The AI sees the summary of the previous section and the title of the next one to create smooth transitions.

### Format Intelligence
The system analyzes the section title to decide the best format:
- **Bullet Points**: For comparisons, lists, steps, or summaries.
- **Paragraphs**: For narratives, introductions, and detailed analysis.

## 2. RAG-Enhanced Generation (Retrieval-Augmented Generation)

For topics requiring up-to-date facts, statistics, or recent events, RAG mode is the game-changer.

### The Workflow
1.  **Search**: The system formulates a search query based on the section title and topic.
2.  **Retrieve**: It searches the live web using Google Custom Search API.
3.  **Read**: It scrapes the top 5 relevant webpages.
4.  **Synthesize**: The content is fed into the LLM as "Research Context".
5.  **Write**: The LLM generates the section, citing facts from the retrieved sources.

### Why Use RAG?
- **Accuracy**: Reduces hallucinations by grounding the AI in real data.
- **Currency**: Access to information published *after* the AI's training cutoff.
- **Citations**: Provides transparency on where the information came from.

## Technical Implementation

See `backend/app/core/llm.py` -> `generate_section` and `backend/app/core/rag.py`.
