# Testing Guide

Guide to testing the DocBuilder application.

## Overview

The project includes:
- **Backend Tests**: pytest for API endpoints
- **Frontend Tests**: Jest for React components
- **CI/CD**: GitHub Actions for automated testing

## Backend Testing

### Running Tests

```bash
cd backend
pytest
```

### Test Coverage

```bash
pytest --cov=app tests/
```

### Test Structure

```
tests/
└── test_endpoints.py
    ├── test_health_check()
    ├── test_create_project()
    ├── test_list_projects()
    ├── test_get_project()
    ├── test_update_project()
    ├── test_delete_project()
    ├── test_suggest_outline()
    ├── test_generate_content()
    ├── test_refine_content()
    ├── test_add_comment()
    ├── test_like_refinement()
    └── test_export_project()
```

### Example Test

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_project():
    response = client.post(
        "/projects",
        json={"title": "Test Project", "doc_type": "docx"},
        headers={"Authorization": "Bearer mock_token"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Project"
```

### Mock LLM Adapter

Tests use the MockLLMAdapter:

```python
# In tests, set environment
os.environ["LLM_PROVIDER"] = "mock"
```

### Writing New Tests

1. Create test function in `test_endpoints.py`
2. Use `TestClient` for API calls
3. Use `mock_token` for authentication
4. Assert response status and data
5. Clean up test data

## Frontend Testing

### Running Tests

```bash
cd frontend
npm test
```

### Test Structure

```
__tests__/
└── index.test.tsx
    └── renders homepage
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index';

describe('Home', () => {
  it('renders homepage', () => {
    render(<Home />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
```

### Writing New Tests

1. Create test file in `__tests__/`
2. Import component to test
3. Use `render()` from testing library
4. Use `screen` to query elements
5. Assert expected behavior

## CI/CD Testing

### GitHub Actions

Workflow: `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main`

**Jobs:**
1. **backend-test**: Run pytest
2. **frontend-test**: Run npm test (when configured)

### Running CI Locally

**Backend:**
```bash
cd backend
export GOOGLE_API_KEY=dummy
export LLM_PROVIDER=mock
export FIREBASE_CREDENTIALS=dummy
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## Manual Testing

### Backend Manual Testing

**Using Swagger UI:**
1. Start backend: `uvicorn app.main:app --reload`
2. Open `http://localhost:8000/docs`
3. Click "Authorize" and enter `mock_token`
4. Try endpoints interactively

**Using curl:**
```bash
# Health check
curl http://localhost:8000/health

# Create project
curl -X POST \
  -H "Authorization: Bearer mock_token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","doc_type":"docx"}' \
  http://localhost:8000/projects
```

### Frontend Manual Testing

1. Start backend and frontend
2. Register new user
3. Create project
4. Generate outline
5. Generate content
6. Refine content
7. Add comments
8. Export document
9. Test all features

## Test Data

### Mock Users

```python
{
  "uid": "test_user_id",
  "email": "test@example.com"
}
```

### Mock Projects

```python
{
  "title": "Test Project",
  "doc_type": "docx",
  "outline": []
}
```

### Mock LLM Responses

```python
# Outline
[
  {"id": "s1", "title": "Introduction", "word_count": 100},
  {"id": "s2", "title": "Market Overview", "word_count": 200}
]

# Content
{
  "title": "Introduction",
  "text": "This is generated content...",
  "bullets": ["Point 1", "Point 2"],
  "word_count": 25
}
```

## Best Practices

1. **Test Coverage**: Aim for >80% coverage
2. **Isolation**: Tests should not depend on each other
3. **Cleanup**: Clean up test data after tests
4. **Mocking**: Use mocks for external services
5. **Assertions**: Test both success and error cases

## Troubleshooting

### Tests Fail Locally

- Ensure dependencies installed
- Check environment variables
- Verify mock LLM provider is set
- Clear pytest cache: `pytest --cache-clear`

### CI Tests Fail

- Check GitHub Actions logs
- Verify environment variables in workflow
- Test locally with same environment
- Check for flaky tests

---

[← Back to Development](project-structure.md) | [Back to Documentation Home](../README.md)
