from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models import Project, ProjectCreate, ProjectUpdate
from app.core.auth import get_current_user
from app.db.firestore import get_db
from datetime import datetime
import uuid

router = APIRouter()

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
    if doc.to_dict()['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")

    adapter = get_llm_adapter()
    try:
        outline_data = adapter.generate_outline(request.topic)
        sections = []
        for item in outline_data:
            sections.append(Section(
                id=item.get("id", str(uuid.uuid4())),
                title=item.get("title", "Untitled"),
                word_count=item.get("word_count", 0),
                status="queued"
            ))
        
        # Update project
        doc_ref.update({"outline": [s.dict() for s in sections], "updated_at": datetime.utcnow()})
        return sections
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
        # Generate
        content_data = adapter.generate_section(target_section.title, project_data.get("title", "Document"), target_section.word_count)
        
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
        # Call LLM
        refinement_data = adapter.refine_section(
            current_text=target_section.content or "",
            history=[h.dict() for h in target_section.refinement_history],
            instructions=request.prompt
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
        
        # Update section
        target_section.content = new_refinement.parsed_text
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

@router.get("/projects/{project_id}/export")
async def export_project(project_id: str, format: str, current_user: dict = Depends(get_current_user)):
    db = get_db()
    doc_ref = db.collection("projects").document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = doc.to_dict()
    if project_data['owner_uid'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if format == 'docx':
        file_stream = ExportService.generate_docx(project_data)
        filename = f"{project_data.get('title', 'project')}.docx"
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif format == 'pptx':
        file_stream = ExportService.generate_pptx(project_data)
        filename = f"{project_data.get('title', 'project')}.pptx"
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'docx' or 'pptx'.")
        
    return StreamingResponse(
        file_stream, 
        media_type=media_type, 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
