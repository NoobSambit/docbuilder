# Project Management

The project management feature allows users to create, read, update, and delete document projects. Each project can be either a DOCX (document) or PPTX (presentation) type.

## Overview

Projects are the core entity in DocBuilder. Each project contains:
- **Metadata**: Title, type, timestamps, owner
- **Content Structure**: Outline with sections/slides
- **AI History**: Record of all LLM interactions
- **User Data**: Comments, refinements, reactions

## Project Types

### DOCX Projects (Documents)
- **Purpose**: Business reports, articles, white papers
- **Structure**: Linear sections with headings
- **Export**: Microsoft Word (.docx) format
- **Content**: Full paragraphs with bullet summaries

### PPTX Projects (Presentations)
- **Purpose**: Slide decks, presentations
- **Structure**: Individual slides
- **Export**: Microsoft PowerPoint (.pptx) format
- **Content**: Bullet points with speaker notes

## CRUD Operations

### Create Project

**Endpoint**: `POST /projects`

**Request:**
```json
{
  "title": "Q4 Business Review",
  "doc_type": "docx"
}
```

**Response:**
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

**Frontend Example:**
```typescript
const createProject = async (title: string, docType: 'docx' | 'pptx') => {
  const token = await auth.currentUser?.getIdToken();
  const response = await axios.post(
    `${API_URL}/projects`,
    { title, doc_type: docType },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
```

### List Projects

**Endpoint**: `GET /projects`

**Response:**
```json
[
  {
    "id": "proj_abc123",
    "title": "Q4 Business Review",
    "doc_type": "docx",
    "created_at": "2025-11-19T02:00:00Z",
    "updated_at": "2025-11-19T02:00:00Z"
  },
  {
    "id": "proj_def456",
    "title": "Product Launch Presentation",
    "doc_type": "pptx",
    "created_at": "2025-11-18T15:30:00Z",
    "updated_at": "2025-11-19T01:45:00Z"
  }
]
```

**Features:**
- Returns only projects owned by authenticated user
- Sorted by `updated_at` (most recent first)
- Includes basic metadata only (full content excluded for performance)

### Get Project

**Endpoint**: `GET /projects/{id}`

**Response:**
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

**Authorization:**
- User must be the project owner
- Returns 404 if project doesn't exist or user doesn't have access

### Update Project

**Endpoint**: `PUT /projects/{id}`

**Request:**
```json
{
  "title": "Q4 Business Review - Updated",
  "outline": [...]
}
```

**Response:**
```json
{
  "id": "proj_abc123",
  "title": "Q4 Business Review - Updated",
  "updated_at": "2025-11-19T03:00:00Z",
  ...
}
```

**Updatable Fields:**
- `title`: Project title
- `outline`: Complete outline array
- `slides`: Slides array (for PPTX)
- `generation_history`: LLM interaction history

**Automatic Updates:**
- `updated_at` timestamp automatically set to current time

### Delete Project

**Endpoint**: `DELETE /projects/{id}`

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

**Behavior:**
- Permanently deletes project and all associated data
- Returns 404 if project doesn't exist or user doesn't have access
- Cannot be undone

## Data Model

### Project Schema

```python
class Project(BaseModel):
    id: str                                    # Unique identifier
    owner_uid: str                             # Firebase user ID
    title: str                                 # Project title
    doc_type: str                              # "docx" or "pptx"
    outline: List[Section]                     # Document sections
    slides: List[Any]                          # For PPTX compatibility
    generation_history: List[GenerationHistoryItem]
    created_at: datetime
    updated_at: datetime
```

### Section Schema

```python
class Section(BaseModel):
    id: str                                    # Unique section ID
    title: str                                 # Section heading
    word_count: int                            # Target word count
    content: Optional[str]                     # Generated content
    bullets: Optional[List[str]]               # Bullet points
    status: str                                # Generation status
    refinement_history: List[Refinement]       # Refinement versions
    comments: List[Comment]                    # User comments
    version: int                               # Content version
```

## Storage

### Firestore Structure

```
projects/
  {project_id}/
    - id: "proj_abc123"
    - owner_uid: "user_xyz789"
    - title: "Q4 Business Review"
    - doc_type: "docx"
    - outline: [...]
    - generation_history: [...]
    - created_at: Timestamp
    - updated_at: Timestamp
```

### Indexing

Firestore automatically indexes:
- `owner_uid` for listing user projects
- `created_at` and `updated_at` for sorting

## Frontend Integration

### Project List Component

```typescript
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    };
    fetchProjects();
  }, []);
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

### Project Detail Component

```typescript
const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(
        `${API_URL}/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(response.data);
    };
    fetchProject();
  }, [projectId]);
  
  // Render project details...
};
```

## Best Practices

### Project Titles
- Use descriptive, meaningful titles
- Include version numbers if needed
- Keep under 100 characters

### Project Organization
- Create separate projects for different documents
- Use consistent naming conventions
- Delete old/unused projects regularly

### Performance
- List view fetches minimal data
- Detail view loads full content only when needed
- Use pagination for large project lists (future enhancement)

## Common Operations

### Duplicate Project
Currently not supported. Workaround:
1. Get project details
2. Create new project with same title + " (Copy)"
3. Update outline with original project's outline

### Archive Project
Currently not supported. Workaround:
- Add "[ARCHIVED]" prefix to title
- Filter archived projects in frontend

## Error Handling

### Common Errors

**404 Not Found**
```json
{
  "detail": "Project not found or you don't have access"
}
```

**401 Unauthorized**
```json
{
  "detail": "Invalid authentication credentials"
}
```

**422 Validation Error**
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

## Related Documentation

- [API: Projects](../api/projects.md)
- [Architecture: Data Models](../architecture.md#data-models)
- [AI Outline Generation](ai-outline-generation.md)

---

[← Back to Features](README.md) | [Next: AI Outline Generation →](ai-outline-generation.md)
