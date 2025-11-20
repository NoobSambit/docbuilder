import pytest
from app.services.export_service import ExportService
from io import BytesIO
import os

@pytest.fixture
def mock_project_data():
    return {
        "title": "Test Export Project",
        "outline": [
            {
                "title": "Introduction",
                "content": "This is the intro content with **bold** text.",
                "bullets": ["Bullet 1", "Bullet 2"]
            },
            {
                "title": "Section 2",
                "content": "More content here.",
                "bullets": []
            }
        ]
    }

def test_generate_docx(mock_project_data):
    docx_file = ExportService.generate_docx(mock_project_data)
    assert isinstance(docx_file, BytesIO)
    assert docx_file.getbuffer().nbytes > 0
    
    # Optional: Save to disk for manual inspection if needed
    # with open("backend/tests/exports/test_export_sample.docx", "wb") as f:
    #     f.write(docx_file.read())

def test_generate_pptx(mock_project_data):
    pptx_file = ExportService.generate_pptx(mock_project_data)
    assert isinstance(pptx_file, BytesIO)
    assert pptx_file.getbuffer().nbytes > 0
