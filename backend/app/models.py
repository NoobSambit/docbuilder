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

class GenerateContentRequest(BaseModel):
    section_id: str
    prompt_override: Optional[str] = None

class RefineRequest(BaseModel):
    prompt: str
    user_id: str

class CommentRequest(BaseModel):
    text: str
    user_id: str
