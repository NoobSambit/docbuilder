# API Reference

Complete API documentation for the DocBuilder backend.

## Base URL

**Development**: `http://localhost:8000`
**Production**: `https://your-backend-url.com`

## Authentication

All API endpoints (except `/health`) require authentication using Firebase ID tokens.

### Authorization Header

```
Authorization: Bearer <firebase_id_token>
```

### Getting a Token

```typescript
import { auth } from './firebase';

const token = await auth.currentUser?.getIdToken();
```

### Example Request

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
     http://localhost:8000/projects
```

## Common Responses

### Success Response

```json
{
  "id": "proj_123",
  "title": "My Project",
  ...
}
```

### Error Response

```json
{
  "detail": "Error message here"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 422 | Validation Error - Invalid data format |
| 500 | Server Error - Internal error |

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Authentication**: Not required

**Response:**
```json
{
  "status": "ok"
}
```

---

For detailed endpoint documentation, see:

- [Authentication Endpoints](authentication.md)
- [Project Endpoints](projects.md)
- [Outline Generation](outline.md)
- [Content Generation](generation.md)
- [Refinement & Collaboration](refinement.md)
- [Export Endpoints](export.md)

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing for production:

- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination

Currently not implemented. All list endpoints return all results.

Future enhancement: Add `?page=1&limit=10` query parameters.

## Filtering & Sorting

Currently not implemented. Projects are sorted by `updated_at` descending.

Future enhancement: Add `?sort_by=created_at&order=asc` query parameters.

## API Versioning

Currently no versioning. All endpoints are at root level.

Future enhancement: Version endpoints as `/v1/projects`, `/v2/projects`, etc.

## Interactive API Documentation

Visit `/docs` on your backend URL for interactive Swagger UI documentation:

**Development**: `http://localhost:8000/docs`

Features:
- Try out endpoints directly
- See request/response schemas
- Test authentication

---

[← Back to Documentation Home](../README.md) | [Next: Projects API →](projects.md)
