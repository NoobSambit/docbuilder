import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.llm import get_llm_adapter, MockLLMAdapter
from app.db.firestore import get_db
from unittest.mock import MagicMock, patch
import datetime

client = TestClient(app)

# Mock DB
mock_db = MagicMock()
mock_collection = MagicMock()
mock_doc_ref = MagicMock()
mock_doc_snapshot = MagicMock()

def override_get_db():
    return mock_db

def override_get_llm_adapter():
    return MockLLMAdapter()

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_llm_adapter] = override_get_llm_adapter

@pytest.fixture
def mock_project_data():
    return {
        "id": "p1",
        "owner_uid": "user1",
        "title": "Test Project",
        "doc_type": "docx",
        "outline": [
            {
                "id": "u1",
                "title": "Intro",
                "content": "Original content",
                "status": "done",
                "refinement_history": [],
                "comments": [],
                "version": 1
            }
        ],
        "generation_history": [],
        "created_at": datetime.datetime.utcnow(),
        "updated_at": datetime.datetime.utcnow()
    }

def test_refine_unit(mock_project_data):
    # Setup mock DB
    mock_db.collection.return_value = mock_collection
    mock_collection.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = mock_project_data

    # Mock auth (assuming we can bypass or mock get_current_user)
    # For simplicity, we might need to override get_current_user too if it's not already handled or if we can't easily mock the token
    with patch("app.api.endpoints.get_current_user", return_value={"uid": "user1"}):
        response = client.post(
            "/projects/p1/units/u1/refine",
            json={"prompt": "Make it better", "user_id": "user1"}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["content"].startswith("Refined version of")
    assert len(data["refinement_history"]) == 1
    assert data["refinement_history"][0]["prompt"] == "Make it better"
    assert data["version"] == 2

def test_add_comment(mock_project_data):
    mock_db.collection.return_value = mock_collection
    mock_collection.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = mock_project_data

    with patch("app.api.endpoints.get_current_user", return_value={"uid": "user1"}):
        response = client.post(
            "/projects/p1/units/u1/comments",
            json={"text": "Nice work", "user_id": "user1"}
        )

    assert response.status_code == 200
    data = response.json()
    assert len(data["comments"]) == 1
    assert data["comments"][0]["text"] == "Nice work"

def test_like_refinement(mock_project_data):
    # Add a refinement to the mock data
    mock_project_data["outline"][0]["refinement_history"].append({
        "id": "r1",
        "user_id": "user1",
        "prompt": "fix",
        "parsed_text": "fixed",
        "created_at": datetime.datetime.utcnow(),
        "likes": [],
        "dislikes": []
    })
    
    mock_db.collection.return_value = mock_collection
    mock_collection.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc_snapshot
    mock_doc_snapshot.exists = True
    mock_doc_snapshot.to_dict.return_value = mock_project_data

    with patch("app.api.endpoints.get_current_user", return_value={"uid": "user2"}):
        response = client.post(
            "/projects/p1/units/u1/refinements/r1/like?user_id=user2"
        )

    assert response.status_code == 200
    data = response.json()
    assert "user2" in data["refinement_history"][0]["likes"]
