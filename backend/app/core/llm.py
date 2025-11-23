from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import os
import json
import uuid
from dotenv import load_dotenv

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.globals import set_llm_cache
from langchain_community.cache import SQLiteCache

# Import Pydantic schemas for structured outputs
from app.models import OutlineSchema, OutlineItemSchema, SectionContentSchema, RefinementOutputSchema

load_dotenv()

# Enable SQLite caching for faster responses on repeated queries
set_llm_cache(SQLiteCache(database_path=".langchain_cache.db"))

class LLMAdapter(ABC):
    @abstractmethod
    def generate_outline(self, topic: str, doc_type: str = "docx", existing_sections: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0) -> Dict[str, Any]:
        pass

    @abstractmethod
    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None) -> Dict[str, Any]:
        pass

class MockLLMAdapter(LLMAdapter):
    def generate_outline(self, topic: str, doc_type: str = "docx", existing_sections: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        # Deterministic mock response
        base_sections = [
            {"id": "s1", "title": "Introduction", "word_count": 100},
            {"id": "s2", "title": "Market Overview", "word_count": 200},
            {"id": "s3", "title": "Key Trends", "word_count": 200},
            {"id": "s4", "title": "Conclusion", "word_count": 100}
        ]

        # If existing sections provided, filter out duplicates and generate complementary ones
        if existing_sections:
            existing_lower = [s.lower() for s in existing_sections]
            new_sections = [s for s in base_sections if s["title"].lower() not in existing_lower]
            return new_sections

        return base_sections

    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0) -> Dict[str, Any]:
        return {
            "title": title,
            "text": f"This is the generated content for section '{title}' regarding '{topic}'. It is a mock response.",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "word_count": 25
        }

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None) -> Dict[str, Any]:
        return {
            "text": f"Refined version of: {current_text[:20]}... based on '{instructions}'",
            "bullets": current_bullets or ["Refined Point 1", "Refined Point 2", "Refined Point 3"],
            "diff_summary": f"Applied changes based on: {instructions}"
        }

class GeminiLLMAdapter(LLMAdapter):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")

        # Initialize LangChain's ChatGoogleGenerativeAI
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=api_key,
            temperature=0.7,
            max_retries=3  # Built-in retry logic
        )

    def generate_outline(self, topic: str, doc_type: str = "docx", existing_sections: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        # Set up Pydantic output parser
        parser = PydanticOutputParser(pydantic_object=OutlineSchema)

        # Document type specific instructions
        doc_guidance = """
DOCUMENT TYPE: PowerPoint Presentation
- Create slide-focused sections (each section = ONE slide)
- Titles should be concise and presentation-friendly (max 8 words)
- Recommend 6-10 sections for a complete presentation
- Word counts MUST be very low (50-120 words per slide/section)
- Focus on 3-5 key bullet points per slide
- Keep content scannable and brief""" if doc_type == "pptx" else """
DOCUMENT TYPE: Word Document / Report
- Create comprehensive report sections with logical flow
- Titles should be descriptive and professional
- Recommend 5-8 sections for a complete document
- Word counts can be higher (100-400 words per section)
- Focus on detailed explanations, analysis, and thorough coverage"""

        # Build existing sections context
        existing_context = ""
        if existing_sections:
            sections_list = "\n".join(f"  - {section}" for section in existing_sections)
            existing_context = f"""
**EXISTING SECTIONS** (already created by user):
{sections_list}

⚠️ IMPORTANT: DO NOT duplicate these sections. Generate ADDITIONAL complementary sections."""

        user_instruction = f"Create additional professional sections for the topic: \"{topic}\" that complement the existing outline" if existing_sections else f"Create a professional outline for the topic: \"{topic}\""

        # Create LangChain prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert document structure architect. {format_instructions}

{doc_guidance}

{existing_context}

REQUIREMENTS:
1. **Logical Flow**: Sections should follow a clear, logical progression
2. **Comprehensive Coverage**: Ensure all important aspects of the topic are covered
3. **Section Structure**: Use sequential IDs (s1, s2, s3), clear titles, appropriate word counts
4. **Quality Standards**: Professional language, clear titles, logical ordering"""),
            ("user", "{user_instruction}")
        ])

        # Build the LangChain chain: prompt | llm | parser
        chain = prompt_template | self.llm | parser

        # Execute the chain
        try:
            result = chain.invoke({
                "format_instructions": parser.get_format_instructions(),
                "doc_guidance": doc_guidance,
                "existing_context": existing_context,
                "user_instruction": user_instruction
            })

            # Convert Pydantic models to dict
            return [item.dict() for item in result.outline]
        except Exception as e:
            print(f"LangChain Error in generate_outline: {e}")
            raise ValueError(f"Failed to generate outline: {str(e)}")

    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0) -> Dict[str, Any]:
        # Set up Pydantic output parser
        parser = PydanticOutputParser(pydantic_object=SectionContentSchema)

        # Build outline context
        outline_str = ""
        if outline_context:
            for idx, section_title in enumerate(outline_context, 1):
                marker = " ← YOU ARE HERE" if idx == section_position else ""
                outline_str += f"{idx}. {section_title}{marker}\n"

        # Style guidance based on document type
        style_guidance = "STYLE: Keep content concise, scannable. Use bullet points. Max 120 words." if doc_type == "pptx" else "STYLE: Professional, comprehensive. Detailed explanations. Formal tone."

        # Create LangChain prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert content writer. {format_instructions}

DOCUMENT CONTEXT:
- Topic: {topic}
- Section: {title}
- Target Words: {word_count}
- Type: {doc_type}

OUTLINE:
{outline_str}

{style_guidance}

REQUIREMENTS:
1. Stay within scope of "{title}" only
2. Use markdown formatting with **bold** and *italic*
3. Provide {word_count} words (±10%)
4. Include 3-5 summary bullets
5. High quality, professional content"""),
            ("user", "Generate content for the section '{title}' about '{topic}'.")
        ])

        # Build the LangChain chain
        chain = prompt_template | self.llm | parser

        # Execute the chain
        try:
            result = chain.invoke({
                "format_instructions": parser.get_format_instructions(),
                "topic": topic,
                "title": title,
                "word_count": word_count,
                "doc_type": doc_type.upper(),
                "outline_str": outline_str,
                "style_guidance": style_guidance
            })

            # Convert markdown to HTML for storage
            import markdown2
            result_dict = result.dict()
            result_dict['text'] = markdown2.markdown(result_dict['text'])
            return result_dict
        except Exception as e:
            print(f"LangChain Error in generate_section: {e}")
            raise ValueError(f"Failed to generate section: {str(e)}")

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None) -> Dict[str, Any]:
        # Set up Pydantic output parser
        parser = PydanticOutputParser(pydantic_object=RefinementOutputSchema)

        # Strip HTML for context
        from bs4 import BeautifulSoup
        clean_text = BeautifulSoup(current_text, 'html.parser').get_text() if '<' in current_text else current_text

        # Build history context (last 7 refinements)
        history_str = ""
        if history:
            for idx, h in enumerate(history[-7:], 1):
                prompt_text = h.get('prompt', 'No prompt')
                history_str += f"{idx}. User: \"{prompt_text}\"\n"

        # Style guidance
        style_guidance = "STYLE: Concise, scannable. Bullet points. Short sentences." if doc_type == "pptx" else "STYLE: Professional, comprehensive. Formal tone. Detailed."

        # Create LangChain prompt template
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert content editor. {format_instructions}

CONTEXT:
- Document: {doc_title}
- Section: {section_title}
- Type: {doc_type}

CURRENT CONTENT:
{current_text}

CURRENT BULLETS:
{current_bullets}

HISTORY:
{history_str}

{style_guidance}

REQUIREMENTS:
1. Follow user's instructions EXACTLY
2. Preserve good aspects of current content
3. Use markdown formatting with **bold** and *italic*
4. Update bullets (3-5 points)
5. Provide brief diff_summary (1-2 sentences)"""),
            ("user", "Refine this content: {instructions}")
        ])

        # Build the LangChain chain
        chain = prompt_template | self.llm | parser

        # Execute the chain
        try:
            result = chain.invoke({
                "format_instructions": parser.get_format_instructions(),
                "doc_title": doc_title or "Document",
                "section_title": section_title or "Section",
                "doc_type": doc_type.upper(),
                "current_text": clean_text[:500],  # Limit context
                "current_bullets": "\n".join(f"• {b}" for b in (current_bullets or [])),
                "history_str": history_str or "First refinement",
                "style_guidance": style_guidance,
                "instructions": instructions
            })

            # Convert markdown to HTML for storage
            import markdown2
            result_dict = result.dict()
            result_dict['text'] = markdown2.markdown(result_dict['text'])
            return result_dict
        except Exception as e:
            print(f"LangChain Error in refine_section: {e}")
            raise ValueError(f"Failed to refine section: {str(e)}")

def get_llm_adapter() -> LLMAdapter:
    provider = os.getenv("LLM_PROVIDER", "mock").lower()
    if provider == "gemini":
        return GeminiLLMAdapter()
    return MockLLMAdapter()
