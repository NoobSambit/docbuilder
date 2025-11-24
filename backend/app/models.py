from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class Refinement(BaseModel):
    id: str
    user_id: str
    prompt: str
    raw_response: Optional[str] = None
    parsed_text: Optional[str] = None
    diff_summary: Optional[str] = None
    created_at: datetime
    likes: List[str] = []
    dislikes: List[str] = []

class Comment(BaseModel):
    id: str
    user_id: str
    text: str
    created_at: datetime

class Section(BaseModel):
    id: str
    title: str
    word_count: int = 0
    content: Optional[str] = None
    bullets: Optional[List[str]] = None
    status: str = "queued" # queued, generating, done, failed
    refinement_history: List[Refinement] = []
    comments: List[Comment] = []
    version: int = 1

class GenerationHistoryItem(BaseModel):
    timestamp: datetime
    prompt: str
    response: Any
    model_meta: Dict[str, Any]
    hash: str

class ProjectBase(BaseModel):
    title: str
    doc_type: str = Field(..., pattern="^(docx|pptx)$")
    outline: List[Section] = []
    slides: List[Any] = [] # Keeping for compatibility, but we might unify if needed, though request said "slides (array for pptx)"
    generation_history: List[GenerationHistoryItem] = []

class ProjectCreate(BaseModel):
    title: str
    doc_type: str = Field(..., pattern="^(docx|pptx)$")

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    outline: Optional[List[Section]] = None
    slides: Optional[List[Any]] = None
    generation_history: Optional[List[GenerationHistoryItem]] = None

class Project(ProjectBase):
    id: str
    owner_uid: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class SuggestOutlineRequest(BaseModel):
    topic: str
    existing_sections: Optional[List[str]] = []  # Titles of existing sections for context

class GenerateContentRequest(BaseModel):
    section_id: str
    prompt_override: Optional[str] = None
    use_rag: Optional[bool] = False  # Enable web search RAG

class RefineRequest(BaseModel):
    prompt: str
    user_id: str

class CommentRequest(BaseModel):
    text: str
    user_id: str

class UpdateSectionContentRequest(BaseModel):
    content: str

class PPTTheme(BaseModel):
    name: str
    display_name: str
    background_color: str  # RGB hex
    title_color: str
    text_color: str
    accent_color: str
    font_title: str = "Arial"
    font_body: str = "Arial"
    description: str

class ExportRequest(BaseModel):
    theme: Optional[str] = "professional"  # theme name

class AddSectionRequest(BaseModel):
    title: str
    position: Optional[int] = None  # If None, append to end

class ReorderOutlineRequest(BaseModel):
    section_ids: List[str]  # Array of section IDs in new order

# LangChain Output Schemas (for structured LLM responses)
class OutlineItemSchema(BaseModel):
    """Schema for a single outline item returned by LLM"""
    id: str = Field(description="Unique identifier for the section")
    title: str = Field(description="Title of the section")
    word_count: int = Field(description="Target word count for this section")

class OutlineSchema(BaseModel):
    """Schema for outline generation response"""
    outline: List[OutlineItemSchema] = Field(description="Array of outline sections")

class SectionContentSchema(BaseModel):
    """Schema for section content generation response"""
    title: str = Field(description="Section title")
    text: str = Field(description="Generated content in HTML/Markdown format")
    bullets: List[str] = Field(description="Key bullet points summarizing the section")
    word_count: int = Field(description="Actual word count of generated content")

class RefinementOutputSchema(BaseModel):
    """Schema for section refinement response"""
    text: str = Field(description="Refined content in HTML/Markdown format")
    bullets: List[str] = Field(description="Updated bullet points")
    diff_summary: str = Field(description="Summary of changes made during refinement")

class UserRegistration(BaseModel):
    email: str
    password: str
    display_name: str

class UserProfile(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None

class RenameProjectRequest(BaseModel):
    title: str
