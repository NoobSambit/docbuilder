from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, MagicMock
import pytest

client = TestClient(app)

# Mock Firebase Auth
@pytest.fixture
def mock_auth():
    with patch("app.core.auth.auth.verify_id_token") as mock_verify:
        mock_verify.return_value = {"uid": "test_user_id", "email": "test@example.com"}
        yield mock_verify

# Mock Firestore
@pytest.fixture
def mock_firestore():
    with patch("app.db.firestore.firestore.client") as mock_client:
        mock_db = MagicMock()
        mock_client.return_value = mock_db
        yield mock_db

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_project_unauthorized():
    response = client.post("/projects", json={"title": "Test", "doc_type": "docx"})
    assert response.status_code == 403 # HTTPBearer returns 403 if no header or 401 if invalid

def test_create_project_authorized(mock_firestore):
    # We can use the "mock_token" backdoor we added in auth.py for simple testing
    # or mock the verify_id_token call.
    # Let's use the backdoor for simplicity in this specific test setup if the mock fixture isn't applied to the dependency override.
    # Actually, let's use the dependency override or just the mock_token string since we implemented that logic.
    
    headers = {"Authorization": "Bearer mock_token"}
    payload = {
        "title": "My New Project",
        "doc_type": "docx",
        "outline": ["Intro", "Body", "Conclusion"]
    }
    
    # Setup mock db return
    mock_db = mock_firestore
    
    response = client.post("/projects", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My New Project"
    assert data["owner_uid"] == "test_user_id"
    assert "id" in data

def test_list_projects(mock_firestore):
    headers = {"Authorization": "Bearer mock_token"}
    
    # Mock stream
    mock_db = mock_firestore
    mock_stream = MagicMock()
    mock_doc = MagicMock()
    mock_doc.to_dict.return_value = {
        "id": "p1", 
        "title": "P1", 
        "owner_uid": "test_user_id", 
        "doc_type": "docx",
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00",
        "outline": []
    }
    mock_stream.return_value = [mock_doc]
    
    # Chain: db.collection().where().stream()
    mock_db.collection.return_value.where.return_value.stream = mock_stream
    
    response = client.get("/projects", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "P1"

def test_suggest_outline(mock_firestore):
    headers = {"Authorization": "Bearer mock_token"}
    
    mock_db = mock_firestore
    mock_doc_ref = MagicMock()
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_doc.to_dict.return_value = {"owner_uid": "test_user_id"}
    
    mock_db.collection.return_value.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc
    
    # Mock LLM Adapter is used by default in tests if env var not set
    
    response = client.post("/projects/p1/suggest-outline", json={"topic": "EV Market"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4 # Mock adapter returns 4 items
    assert data[0]["title"] == "Introduction"
    
    # Verify DB update called
    mock_doc_ref.update.assert_called_once()

def test_generate_content(mock_firestore):
    headers = {"Authorization": "Bearer mock_token"}
    
    mock_db = mock_firestore
    mock_doc_ref = MagicMock()
    mock_doc = MagicMock()
    mock_doc.exists = True
    mock_doc.to_dict.return_value = {
        "owner_uid": "test_user_id",
        "title": "My Doc",
        "outline": [{"id": "s1", "title": "Intro", "word_count": 100, "status": "queued"}]
    }
    
    mock_db.collection.return_value.document.return_value = mock_doc_ref
    mock_doc_ref.get.return_value = mock_doc
    
    response = client.post("/projects/p1/generate", json={"section_id": "s1"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"
    assert "generated content" in data["content"]
    
    # Verify DB update called (twice: once for generating, once for done)
    assert mock_doc_ref.update.call_count >= 2
