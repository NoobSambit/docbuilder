# LangSmith Monitoring Setup Guide

## What is LangSmith?

LangSmith is LangChain's official observability platform that provides:
- **Real-time LLM call tracking** - See every prompt and response
- **Performance monitoring** - Track latency, token usage, and costs
- **Error debugging** - Detailed error traces and stack traces
- **Prompt versioning** - Compare different prompt versions
- **Cost analytics** - Monitor API spending across projects
- **Chain visualization** - See how your LangChain chains execute

## Setup Instructions

### Step 1: Create LangSmith Account

1. Go to https://smith.langchain.com/
2. Click "Sign Up" (free tier available)
3. Sign up with GitHub, Google, or email
4. Verify your email

### Step 2: Get Your API Key

1. Once logged in, click your profile (top right)
2. Go to "Settings" → "API Keys"
3. Click "Create API Key"
4. Name it "docbuilder-backend"
5. Copy the API key (you'll only see it once!)

### Step 3: Update Your `.env` File

Add these lines to `backend/.env`:

```env
# LangSmith Configuration (for monitoring)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls-xxx-your-api-key-here
LANGCHAIN_PROJECT=docbuilder-production
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

### Step 4: Update Your Code (Optional Enhancement)

Add this to `backend/app/core/llm.py` at the top (after imports):

```python
import os

# Enable LangSmith tracing if configured
if os.getenv("LANGCHAIN_TRACING_V2") == "true":
    print("✓ LangSmith tracing enabled")
```

### Step 5: Restart Your Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Step 6: Test and View in LangSmith

1. Make an API call (generate outline, section, or refinement)
2. Go to https://smith.langchain.com/
3. Click on your project "docbuilder-production"
4. You'll see all LLM calls in real-time!

## What You'll See in LangSmith

### 1. **Trace View**
- Complete execution flow of your LangChain chains
- Prompt → LLM → Parser visualization
- Timing for each step
- Input/output at each stage

### 2. **Runs Page**
Every LLM call shows:
- **Inputs**: The prompt sent to Gemini
- **Outputs**: The parsed response
- **Metadata**: Model name, temperature, token count
- **Latency**: How long the call took
- **Status**: Success, error, or cached
- **Cost**: Estimated API cost

### 3. **Monitoring Dashboard**
- Total requests over time
- Average latency trends
- Error rate
- Token usage
- Cost tracking

### 4. **Prompt Comparison**
- Test different prompts side-by-side
- See which prompts perform better
- Version control for prompts

### 5. **Error Debugging**
When errors occur:
- Full stack trace
- Input that caused the error
- LLM response (even if parsing failed)
- Retry history

## Example LangSmith Trace

When you call `generate_outline("AI in Healthcare")`:

```
docbuilder-production
└── generate_outline
    ├── ChatPromptTemplate (1ms)
    │   └── Formatted prompt with topic
    ├── ChatGoogleGenerativeAI (2.3s)
    │   ├── Input tokens: 245
    │   ├── Output tokens: 156
    │   └── Cost: $0.0004
    └── PydanticOutputParser (15ms)
        └── Validated OutlineSchema
```

You can click on each step to see:
- Exact prompt sent
- Raw LLM response
- Parsed output
- Any errors or warnings

## Advanced Features

### 1. **Add Custom Metadata**

Tag your runs for better organization:

```python
from langsmith import traceable

@traceable(
    run_type="llm",
    name="outline_generation",
    metadata={"user_id": "user123", "doc_type": "pptx"}
)
def generate_outline(...):
    # Your code
```

### 2. **Filter and Search**

In LangSmith, filter by:
- Time range
- Status (success/error)
- Latency (slow calls)
- Metadata tags
- User ID

### 3. **Set Up Alerts**

Configure alerts for:
- Error rate > 5%
- Latency > 5 seconds
- Daily cost > $10
- Specific error types

### 4. **Cost Tracking**

Monitor costs by:
- Project
- User
- Document type
- Time period
- Model version

## Free Tier Limits

LangSmith Free Tier includes:
- 5,000 traces/month
- 30 days data retention
- 1 project
- Basic monitoring

Paid tiers:
- Developer: $39/month (50K traces)
- Team: $199/month (500K traces)
- Enterprise: Custom pricing

## Troubleshooting

### "Traces not appearing"
1. Check `.env` has `LANGCHAIN_TRACING_V2=true`
2. Verify API key is correct
3. Restart backend server
4. Check network connection

### "Authentication failed"
- Regenerate API key in LangSmith
- Update `.env` file
- Restart server

### "Project not found"
- Create project in LangSmith UI first
- Or let it auto-create on first trace

## Best Practices

1. **Use different projects** for dev/staging/production
2. **Add metadata** to track users, document types, etc.
3. **Review slow traces** to optimize performance
4. **Monitor costs** to stay within budget
5. **Set up alerts** for errors and anomalies

## Demo Query

After setup, test with:

```bash
curl -X POST http://localhost:8000/projects/{project_id}/suggest-outline \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI in Healthcare"}'
```

Then check LangSmith to see the trace!

## Resources

- LangSmith Docs: https://docs.smith.langchain.com/
- LangSmith Dashboard: https://smith.langchain.com/
- Pricing: https://www.langchain.com/pricing
- Support: support@langchain.dev

---

**Pro Tip**: During interviews, showing your LangSmith dashboard with real traces demonstrates production-ready LLM development!
