from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMAdapter(ABC):
    @abstractmethod
    def generate_outline(self, topic: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str) -> Dict[str, Any]:
        pass

class MockLLMAdapter(LLMAdapter):
    def generate_outline(self, topic: str) -> List[Dict[str, Any]]:
        # Deterministic mock response
        return [
            {"id": "s1", "title": "Introduction", "word_count": 100},
            {"id": "s2", "title": "Market Overview", "word_count": 200},
            {"id": "s3", "title": "Key Trends", "word_count": 200},
            {"id": "s4", "title": "Conclusion", "word_count": 100}
        ]

    def generate_section(self, title: str, topic: str, word_count: int) -> Dict[str, Any]:
        return {
            "title": title,
            "text": f"This is the generated content for section '{title}' regarding '{topic}'. It is a mock response.",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "word_count": 25
        }

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str) -> Dict[str, Any]:
        return {
            "text": f"Refined version of: {current_text[:20]}... based on '{instructions}'",
            "diff_summary": f"Applied changes based on: {instructions}"
        }

class GeminiLLMAdapter(LLMAdapter):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def _call_gemini(self, prompt: str) -> str:
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            raise

    def generate_outline(self, topic: str) -> List[Dict[str, Any]]:
        prompt = f"""
SYSTEM: Return only JSON that adheres to the schema {{ "outline": [{{"id": "s1", "title": "...", "word_count": 150}}, ...] }}.
USER: For the topic: "{topic}", produce a business-report outline with 5-8 sections. Each section: id, title, and recommended word_count (50-400). Return only JSON, nothing else.
"""
        raw_response = self._call_gemini(prompt)
        # Basic cleanup for markdown code blocks if present
        cleaned_response = raw_response.replace("```json", "").replace("```", "").strip()
        try:
            data = json.loads(cleaned_response)
            return data.get("outline", [])
        except json.JSONDecodeError:
            # Simple retry logic could go here, or return raw error
            raise ValueError(f"Invalid JSON from LLM: {raw_response}")

    def generate_section(self, title: str, topic: str, word_count: int) -> Dict[str, Any]:
        prompt = f"""
SYSTEM: Return only JSON that adheres to {{ "title": "...", "text": "...", "bullets": ["..."], "word_count": N }}.
USER: Generate content for section titled "{title}" for the topic "{topic}". Tone: Professional. Max words: {word_count}. Provide short bullet summary plus full section text. Return only JSON, no commentary.
"""
        raw_response = self._call_gemini(prompt)
        cleaned_response = raw_response.replace("```json", "").replace("```", "").strip()
        try:
            data = json.loads(cleaned_response)
            return data
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON from LLM: {raw_response}")

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str) -> Dict[str, Any]:
        # Construct history context string
        history_str = ""
        for h in history[-3:]: # Last 3 items
            history_str += f"- Prompt: {h.get('prompt')}\n  Response: {h.get('parsed_text')[:50]}...\n"

        prompt = f"""
SYSTEM: Return only JSON that adheres to {{ "text": "...", "diff_summary": "..." }}.
CONTEXT:
Original Text: {current_text}
History:
{history_str}
USER: Refine the text based on these instructions: "{instructions}". Return the new text and a brief summary of changes (diff_summary). Return only JSON.
"""
        raw_response = self._call_gemini(prompt)
        cleaned_response = raw_response.replace("```json", "").replace("```", "").strip()
        try:
            data = json.loads(cleaned_response)
            return data
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON from LLM: {raw_response}")

def get_llm_adapter() -> LLMAdapter:
    provider = os.getenv("LLM_PROVIDER", "mock").lower()
    if provider == "gemini":
        return GeminiLLMAdapter()
    return MockLLMAdapter()
