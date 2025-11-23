# LangChain Integration Architecture

This document details how the application uses [LangChain](https://python.langchain.com/) to orchestrate interactions with the Google Gemini LLM.

## Overview

We use LangChain to provide a robust, structured, and efficient interface for AI operations. The integration follows the modern "LCEL" (LangChain Expression Language) pattern:

`Chain = Prompt | LLM | Parser`

## Key Components

### 1. LLM Provider (`ChatGoogleGenerativeAI`)
We use the `langchain-google-genai` package to interact with Gemini models.
- **Model**: `gemini-2.0-flash`
- **Configuration**:
  - `temperature`: 0.7 (balanced creativity)
  - `max_retries`: 3 (built-in exponential backoff)

### 2. Structured Output (`PydanticOutputParser`)
Instead of relying on fragile JSON parsing of raw text, we use Pydantic models to define the expected structure. LangChain automatically:
1. Injects format instructions into the prompt.
2. Validates the LLM's response against the schema.
3. Parses the response into a Python object (dict).

**Schemas used:**
- `OutlineSchema`: For outline generation
- `SectionContentSchema`: For content generation
- `RefinementOutputSchema`: For smart refinement

### 3. Prompt Templates (`ChatPromptTemplate`)
Prompts are constructed using templates that separate logic from text. This allows for:
- Dynamic variable injection (e.g., `{topic}`, `{word_count}`)
- System message separation
- Reusability

### 4. Caching (`SQLiteCache`)
To improve performance and reduce costs during development/testing, we use SQLite caching.
- **Implementation**: `set_llm_cache(SQLiteCache(database_path=".langchain_cache.db"))`
- **Benefit**: Identical requests return instantly without hitting the API.

## Implementation Patterns

### The Chain Pattern
All LLM operations follow this standard pattern in `backend/app/core/llm.py`:

```python
# 1. Define Parser
parser = PydanticOutputParser(pydantic_object=MySchema)

# 2. Define Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert... {format_instructions}"),
    ("user", "{user_input}")
])

# 3. Build Chain
chain = prompt | llm | parser

# 4. Invoke
result = chain.invoke({
    "format_instructions": parser.get_format_instructions(),
    "user_input": "..."
})
```

## Benefits
- **Reliability**: Structured parsing eliminates "invalid JSON" errors.
- **Maintainability**: Clear separation of concerns (Prompt vs Logic).
- **Performance**: Caching and automatic retries.
- **Scalability**: Easy to swap models or add new chains.
