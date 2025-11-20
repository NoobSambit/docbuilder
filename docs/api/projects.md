# Projects API

API endpoints for managing projects (CRUD operations).

## List Projects

**GET** `/projects`

Get all projects owned by the authenticated user.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

### Response

**Status**: 200 OK

**Body:**
```json
[
  {
    "id": "proj_abc123",
    "owner_uid": "user_xyz789",
    "title": "Q4 Business Review",
    "doc_type": "docx",
    "outline": [...],
    "generation_history": [...],
    "created_at": "2025-11-19T02:00:00Z",
    "updated_at": "2025-11-19T02:30:00Z"
  },
  {
    "id": "proj_def456",
    "title": "Product Launch Presentation",
    "doc_type": "pptx",
    ...
  }
]
```

### Example

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/projects
```

```typescript
const response = await axios.get(`${API_URL}/projects`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## Create Project

**POST** `/projects`

Create a new project.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Q4 Business Review",
  "doc_type": "docx"
}
```

**Fields:**
- `title` (string, required): Project title
- `doc_type` (string, required): `"docx"` or `"pptx"`

### Response

**Status**: 201 Created

**Body:**
```json
{
  "id": "proj_abc123",
  "owner_uid": "user_xyz789",
  "title": "Q4 Business Review",
  "doc_type": "docx",
  "outline": [],
  "slides": [],
  "generation_history": [],
  "created_at": "2025-11-19T02:00:00Z",
  "updated_at": "2025-11-19T02:00:00Z"
}
```

### Example

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Q4 Business Review","doc_type":"docx"}' \
  http://localhost:8000/projects
```

```typescript
const response = await axios.post(
  `${API_URL}/projects`,
  { title: "Q4 Business Review", doc_type: "docx" },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Errors

**422 Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "doc_type"],
      "msg": "string does not match regex \"^(docx|pptx)$\"",
      "type": "value_error.str.regex"
    }
  ]
}
```

---

## Get Project

**GET** `/projects/{id}`

Get a specific project by ID.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Path Parameters:**
- `id` (string): Project ID

### Response

**Status**: 200 OK

**Body:**
```json
{
  "id": "proj_abc123",
  "owner_uid": "user_xyz789",
  "title": "Q4 Business Review",
  "doc_type": "docx",
  "outline": [
    {
      "id": "sec_001",
      "title": "Executive Summary",
      "word_count": 150,
      "content": "This quarter showed...",
      "bullets": ["Revenue up 15%", "New markets entered"],
      "status": "done",
      "refinement_history": [],
      "comments": [],
      "version": 1
    }
  ],
  "generation_history": [...],
  "created_at": "2025-11-19T02:00:00Z",
  "updated_at": "2025-11-19T02:30:00Z"
}
```

### Example

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/projects/proj_abc123
```

```typescript
const response = await axios.get(
  `${API_URL}/projects/${projectId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Errors

**404 Not Found:**
```json
{
  "detail": "Project not found or you don't have access"
}
```

---

## Update Project

**PUT** `/projects/{id}`

Update a project.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string): Project ID

**Body:**
```json
{
  "title": "Q4 Business Review - Updated",
  "outline": [...]
}
```

**Updatable Fields:**
- `title` (string, optional): New title
- `outline` (array, optional): Updated outline
- `slides` (array, optional): Updated slides
- `generation_history` (array, optional): Updated history

### Response

**Status**: 200 OK

**Body:** Updated project object

### Example

```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Q4 Business Review - Updated"}' \
  http://localhost:8000/projects/proj_abc123
```

```typescript
const response = await axios.put(
  `${API_URL}/projects/${projectId}`,
  { title: "Q4 Business Review - Updated" },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## Delete Project

**DELETE** `/projects/{id}`

Delete a project permanently.

### Request

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Path Parameters:**
- `id` (string): Project ID

### Response

**Status**: 200 OK

**Body:**
```json
{
  "message": "Project deleted successfully"
}
```

### Example

```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  http://localhost:8000/projects/proj_abc123
```

```typescript
await axios.delete(
  `${API_URL}/projects/${projectId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Errors

**404 Not Found:**
```json
{
  "detail": "Project not found or you don't have access"
}
```

---

## Related Documentation

- [Project Management Feature](../features/project-management.md)
- [API Overview](README.md)
- [Outline API](outline.md)

---

[← Back to API Overview](README.md) | [Next: Outline API →](outline.md)
