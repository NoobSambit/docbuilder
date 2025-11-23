from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models import Project, ProjectCreate, ProjectUpdate, UserRegistration, UserProfile, RenameProjectRequest
from app.core.auth import get_current_user
from app.db.firestore import get_db
from datetime import datetime
import uuid
import os
import bleach

router = APIRouter()

# User Registration and Profile Endpoints
@router.post("/auth/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegistration):
    """Register a new user and save display name to Firestore"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        # Note: Actual Firebase Auth user creation happens on the frontend
        # This endpoint just stores the display_name in Firestore
        # The frontend should call this after successfully creating the Firebase Auth user

        # For now, we'll just return success
        # In a real implementation, you'd want to verify the user exists in Firebase Auth
        return UserProfile(
            uid="pending",  # Will be updated by frontend
            email=user_data.email,
            display_name=user_data.display_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")

@router.post("/auth/save-profile", status_code=status.HTTP_200_OK)
async def save_user_profile(current_user: dict = Depends(get_current_user)):
    """Save or update user profile in Firestore"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        user_ref = db.collection("users").document(current_user['uid'])

        # Get display_name from Firebase Auth custom claims or use email as fallback
        display_name = current_user.get('name', current_user.get('email', '').split('@')[0])

        user_data = {
            "uid": current_user['uid'],
            "email": current_user.get('email', ''),
            "display_name": display_name,
            "updated_at": datetime.utcnow()
        }

        # Check if user exists
        doc = user_ref.get()
        if doc.exists:
            user_ref.update(user_data)
        else:
            user_data["created_at"] = datetime.utcnow()
            user_ref.set(user_data)

        return {"message": "Profile saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")

@router.get("/auth/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile from Firestore"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        user_ref = db.collection("users").document(current_user['uid'])
        doc = user_ref.get()

        if doc.exists:
            user_data = doc.to_dict()
            return UserProfile(
                uid=user_data.get('uid', current_user['uid']),
                email=user_data.get('email', current_user.get('email', '')),
                display_name=user_data.get('display_name')
            )
        else:
            # Return profile from Firebase Auth token if not in Firestore yet
            return UserProfile(
                uid=current_user['uid'],
                email=current_user.get('email', ''),
                display_name=current_user.get('name', current_user.get('email', '').split('@')[0])
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@router.post("/projects", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project_in: ProjectCreate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    project_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    project_data = project_in.dict()
    project_data.update({
        "id": project_id,
        "owner_uid": current_user['uid'],
        "created_at": now,
        "updated_at": now,
        "generation_history": []
    })
    
    try:
        db.collection("projects").document(project_id).set(project_data)
        return project_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@router.get("/projects", response_model=List[Project])
async def list_projects(current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    try:
        projects_ref = db.collection("projects").where("owner_uid", "==", current_user['uid'])
        docs = projects_ref.stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
            
        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
             raise HTTPException(status_code=403, detail="Not authorized to access this project")
             
        return project_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_in: ProjectUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
            
        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
             raise HTTPException(status_code=403, detail="Not authorized to update this project")
        
        update_data = project_in.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        
        doc_ref.update(update_data)
        
        # Return updated document
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
             raise HTTPException(status_code=403, detail="Not authorized to delete this project")

        doc_ref.delete()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@router.patch("/projects/{project_id}/rename", response_model=Project)
async def rename_project(project_id: str, request: RenameProjectRequest, current_user: dict = Depends(get_current_user)):
    """Rename a project"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
             raise HTTPException(status_code=403, detail="Not authorized to rename this project")

        # Update the title
        doc_ref.update({
            "title": request.title,
            "updated_at": datetime.utcnow()
        })

        # Return updated document
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rename project: {str(e)}")

from app.models import UpdateSectionContentRequest

@router.put("/projects/{project_id}/sections/{section_id}/content")
async def update_section_content(
    project_id: str,
    section_id: str,
    request: UpdateSectionContentRequest,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

        # Sanitize HTML content
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'span']
        allowed_attrs = {
            'p': ['class'],
            'h2': ['class'],
            'h3': ['class'],
            '*': ['class']
        }
        sanitized_content = bleach.clean(
            request.content,
            tags=allowed_tags,
            attributes=allowed_attrs,
            strip=True
        )

        # Find and update the section
        sections = [Section(**s) for s in project_data.get('outline', [])]
        target_section = next((s for s in sections if s.id == section_id), None)

        if not target_section:
            raise HTTPException(status_code=404, detail="Section not found")

        # Update content
        target_section.content = sanitized_content
        target_section.version += 1

        # Save to database
        doc_ref.update({
            "outline": [s.dict() for s in sections],
            "updated_at": datetime.utcnow()
        })

        return target_section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update section content: {str(e)}")

from app.models import AddSectionRequest, ReorderOutlineRequest, Section

@router.post("/projects/{project_id}/sections", response_model=Section, status_code=status.HTTP_201_CREATED)
async def add_section(
    project_id: str,
    request: AddSectionRequest,
    current_user: dict = Depends(get_current_user)
):
    """Add a new section to the project outline"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

        # Create new section
        new_section = Section(
            id=str(uuid.uuid4()),
            title=request.title,
            word_count=0,
            status="queued"
        )

        # Get current sections
        sections = [Section(**s) for s in project_data.get('outline', [])]

        # Insert at position or append
        if request.position is not None and 0 <= request.position <= len(sections):
            sections.insert(request.position, new_section)
        else:
            sections.append(new_section)

        # Save to database
        doc_ref.update({
            "outline": [s.dict() for s in sections],
            "updated_at": datetime.utcnow()
        })

        return new_section

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add section: {str(e)}")

@router.delete("/projects/{project_id}/sections/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(
    project_id: str,
    section_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a section from the project outline"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

        # Get current sections
        sections = [Section(**s) for s in project_data.get('outline', [])]
        original_count = len(sections)

        # Filter out the section to delete
        sections = [s for s in sections if s.id != section_id]

        # Check if section was found and removed
        if len(sections) == original_count:
            raise HTTPException(status_code=404, detail="Section not found")

        # Save to database
        doc_ref.update({
            "outline": [s.dict() for s in sections],
            "updated_at": datetime.utcnow()
        })

        return None

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete section: {str(e)}")

@router.put("/projects/{project_id}/outline", response_model=List[Section])
async def reorder_outline(
    project_id: str,
    request: ReorderOutlineRequest,
    current_user: dict = Depends(get_current_user)
):
    """Reorder sections in the project outline"""
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        doc_ref = db.collection("projects").document(project_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")

        project_data = doc.to_dict()
        if project_data['owner_uid'] != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to update this project")

        # Get current sections
        sections = [Section(**s) for s in project_data.get('outline', [])]

        # Create a map of section_id to section
        section_map = {s.id: s for s in sections}

        # Validate all section IDs exist and count matches
        if len(request.section_ids) != len(sections):
            raise HTTPException(status_code=400, detail="Section count mismatch")

        for section_id in request.section_ids:
            if section_id not in section_map:
                raise HTTPException(status_code=404, detail=f"Section {section_id} not found")

        # Reorder sections according to the provided IDs
        reordered_sections = [section_map[section_id] for section_id in request.section_ids]

        # Save to database
        doc_ref.update({
            "outline": [s.dict() for s in reordered_sections],
            "updated_at": datetime.utcnow()
        })

        return reordered_sections

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reorder sections: {str(e)}")

from app.models import SuggestOutlineRequest, GenerateContentRequest, Section, GenerationHistoryItem
from app.core.llm import get_llm_adapter
import hashlib

@router.post("/projects/{project_id}/suggest-outline", response_model=List[Section])
async def suggest_outline(project_id: str, request: SuggestOutlineRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Verify ownership
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")

    adapter = get_llm_adapter()
    try:
        # Get document type from project data (default to docx if not specified)
        doc_type = project_data.get("doc_type", "docx")

        # Get existing sections from project
        existing_sections_data = project_data.get("outline", [])
        existing_sections = [Section(**s) for s in existing_sections_data]
        existing_titles = [s.title for s in existing_sections]

        # Generate outline with document type context and existing sections
        outline_data = adapter.generate_outline(
            request.topic,
            doc_type=doc_type,
            existing_sections=existing_titles if existing_titles else None
        )

        # Create new section objects with deduplication
        new_sections = []
        existing_titles_lower = [title.lower().strip() for title in existing_titles]

        for item in outline_data:
            new_title = item.get("title", "Untitled")
            # Skip if this title already exists (case-insensitive)
            if new_title.lower().strip() not in existing_titles_lower:
                new_sections.append(Section(
                    id=item.get("id", str(uuid.uuid4())),
                    title=new_title,
                    word_count=item.get("word_count", 0),
                    status="queued"
                ))

        # Combine existing and new sections
        all_sections = existing_sections + new_sections

        # Update project with combined outline
        doc_ref.update({"outline": [s.dict() for s in all_sections], "updated_at": datetime.utcnow()})
        return new_sections  # Return only the newly generated sections
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")

@router.post("/projects/{project_id}/generate", response_model=Section)
async def generate_content(project_id: str, request: GenerateContentRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Find section
    sections = [Section(**s) for s in project_data.get('outline', [])]
    target_section = next((s for s in sections if s.id == request.section_id), None)
    
    if not target_section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Update status to generating
    target_section.status = "generating"
    doc_ref.update({"outline": [s.dict() for s in sections]})
    
    adapter = get_llm_adapter()
    try:
        # Build outline context (all section titles)
        outline_context = [s.title for s in sections]

        # Find the position of the current section
        section_position = next((idx + 1 for idx, s in enumerate(sections) if s.id == request.section_id), 0)

        # Get document type (default to docx if not specified)
        doc_type = project_data.get("doc_type", "docx")

        # Generate with full context
        content_data = adapter.generate_section(
            title=target_section.title,
            topic=project_data.get("title", "Document"),
            word_count=target_section.word_count,
            outline_context=outline_context,
            doc_type=doc_type,
            section_position=section_position
        )

        # Update section
        target_section.content = content_data.get("text", "")
        target_section.bullets = content_data.get("bullets", [])
        target_section.status = "done"
        
        # Record history
        prompt_used = f"Generate section '{target_section.title}'..." # Simplified for logging
        history_item = GenerationHistoryItem(
            timestamp=datetime.utcnow(),
            prompt=prompt_used,
            response=content_data,
            model_meta={"provider": os.getenv("LLM_PROVIDER", "mock")},
            hash=hashlib.sha256((prompt_used + str(content_data)).encode()).hexdigest()
        )
        
        # Update DB
        # Note: Firestore array_union might be cleaner but we need to update the specific section in the array too
        # So we just replace the whole outline array
        
        current_history = project_data.get("generation_history", [])
        current_history.append(history_item.dict())
        
        doc_ref.update({
            "outline": [s.dict() for s in sections],
            "generation_history": current_history,
            "updated_at": datetime.utcnow()
        })
        
        return target_section
        
    except Exception as e:
        target_section.status = "failed"
        doc_ref.update({"outline": [s.dict() for s in sections]})
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

from app.models import RefineRequest, CommentRequest, Refinement, Comment

@router.post("/projects/{project_id}/units/{unit_id}/refine", response_model=Section)
async def refine_unit(project_id: str, unit_id: str, request: RefineRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    sections = [Section(**s) for s in project_data.get('outline', [])]
    target_section = next((s for s in sections if s.id == unit_id), None)
    
    if not target_section:
        raise HTTPException(status_code=404, detail="Unit not found")
        
    adapter = get_llm_adapter()
    try:
        # Build outline context (all section titles)
        outline_context = [s.title for s in sections]

        # Get document type (default to docx if not specified)
        doc_type = project_data.get("doc_type", "docx")

        # Call LLM with full context including document title and outline
        refinement_data = adapter.refine_section(
            current_text=target_section.content or "",
            history=[h.dict() for h in target_section.refinement_history],
            instructions=request.prompt,
            current_bullets=target_section.bullets,
            doc_title=project_data.get("title", "Document"),
            outline_context=outline_context,
            doc_type=doc_type,
            section_title=target_section.title
        )

        # Create Refinement record
        new_refinement = Refinement(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            prompt=request.prompt,
            raw_response=str(refinement_data),
            parsed_text=refinement_data.get("text", ""),
            diff_summary=refinement_data.get("diff_summary", ""),
            created_at=datetime.utcnow()
        )
        
        # Update section content and bullets
        target_section.content = new_refinement.parsed_text
        if refinement_data.get("bullets"):
            target_section.bullets = refinement_data.get("bullets")
        target_section.refinement_history.append(new_refinement)
        target_section.version += 1
        
        # Save
        doc_ref.update({
            "outline": [s.dict() for s in sections],
            "updated_at": datetime.utcnow()
        })
        
        return target_section
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {str(e)}")

@router.post("/projects/{project_id}/units/{unit_id}/comments", response_model=Section)
async def add_comment(project_id: str, unit_id: str, request: CommentRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    sections = [Section(**s) for s in project_data.get('outline', [])]
    target_section = next((s for s in sections if s.id == unit_id), None)
    
    if not target_section:
        raise HTTPException(status_code=404, detail="Unit not found")
        
    new_comment = Comment(
        id=str(uuid.uuid4()),
        user_id=request.user_id,
        text=request.text,
        created_at=datetime.utcnow()
    )
    
    target_section.comments.append(new_comment)
    target_section.version += 1
    
    doc_ref.update({
        "outline": [s.dict() for s in sections],
        "updated_at": datetime.utcnow()
    })
    
    return target_section

@router.post("/projects/{project_id}/units/{unit_id}/refinements/{rid}/like", response_model=Section)
async def like_refinement(project_id: str, unit_id: str, rid: str, user_id: str, current_user: dict = Depends(get_current_user)):
    # Note: user_id param is redundant if we use current_user, but keeping for consistency with request
    return await _toggle_reaction(project_id, unit_id, rid, current_user['uid'], "like")

@router.post("/projects/{project_id}/units/{unit_id}/refinements/{rid}/dislike", response_model=Section)
async def dislike_refinement(project_id: str, unit_id: str, rid: str, user_id: str, current_user: dict = Depends(get_current_user)):
    return await _toggle_reaction(project_id, unit_id, rid, current_user['uid'], "dislike")

async def _toggle_reaction(project_id: str, unit_id: str, rid: str, user_id: str, reaction_type: str):
    db = get_db()
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    sections = [Section(**s) for s in project_data.get('outline', [])]
    target_section = next((s for s in sections if s.id == unit_id), None)
    
    if not target_section:
        raise HTTPException(status_code=404, detail="Unit not found")
        
    target_refinement = next((r for r in target_section.refinement_history if r.id == rid), None)
    if not target_refinement:
        raise HTTPException(status_code=404, detail="Refinement not found")
        
    if reaction_type == "like":
        if user_id in target_refinement.likes:
            target_refinement.likes.remove(user_id)
        else:
            target_refinement.likes.append(user_id)
            if user_id in target_refinement.dislikes:
                target_refinement.dislikes.remove(user_id)
    elif reaction_type == "dislike":
        if user_id in target_refinement.dislikes:
            target_refinement.dislikes.remove(user_id)
        else:
            target_refinement.dislikes.append(user_id)
            if user_id in target_refinement.likes:
                target_refinement.likes.remove(user_id)
                
    target_section.version += 1
    
    doc_ref.update({
        "outline": [s.dict() for s in sections],
        "updated_at": datetime.utcnow()
    })
    
    return target_section

from fastapi.responses import StreamingResponse
from app.services.export_service import ExportService

@router.get("/themes")
async def get_themes():
    """Get all available PPT themes"""
    return {"themes": list(ExportService.THEMES.values())}

@router.get("/projects/{project_id}/export")
async def export_project(
    project_id: str,
    format: str,
    theme: str = "professional",
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Sanitize filename
    import re
    from urllib.parse import quote
    safe_title = re.sub(r'[<>:"/\\|?*]', '', project_data.get('title', 'project'))

    if format == 'docx':
        file_stream = ExportService.generate_docx(project_data)
        filename = f"{safe_title}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif format == 'pptx':
        file_stream = ExportService.generate_pptx(project_data, theme_name=theme)
        filename = f"{safe_title}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'docx' or 'pptx'.")

    # Encode filename for Content-Disposition header (RFC 6266)
    # Use both filename and filename* for maximum compatibility
    encoded_filename = quote(filename)

    return StreamingResponse(
        file_stream,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
        }
    )
