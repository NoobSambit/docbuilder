# API Endpoints Reference

For complete API documentation, see [DOCUMENTATION.md - API Reference](../../DOCUMENTATION.md#api-reference).

## Authentication

All endpoints require `Authorization: Bearer <firebase_token>` header.

## Endpoints Overview

### Projects
- `POST /projects` - Create project
- `GET /projects` - List all projects
- `GET /projects/{id}` - Get specific project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Outline
- `POST /projects/{id}/suggest-outline` - Generate AI outline

### Content
- `POST /projects/{id}/generate` - Generate content (with RAG option)

### Refinement
- `POST /projects/{id}/units/{section_id}/refine` - Refine content

### Export
- `GET /projects/{id}/export?format=docx&theme=professional` - Export document

## Example: Generate Content with RAG

```bash
curl -X POST http://localhost:8000/projects/{id}/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "section_id": "s1",
    "use_rag": true
  }'
```

See main documentation for complete API reference.

[← Back to Documentation Home](../README.md)
