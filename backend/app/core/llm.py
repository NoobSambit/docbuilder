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
        style_guidance = """STYLE FOR PRESENTATIONS:
- Use bullet points (markdown format: - or *) for EVERY slide
- Keep each bullet to 1-2 short sentences maximum
- Focus on key takeaways, not long explanations
- Max 120 words total per slide
- Scannable, concise, impactful""" if doc_type == "pptx" else """STYLE FOR DOCUMENTS:
- Use paragraphs for narrative sections (Introduction, Background, Conclusion)
- Use bullet points for comparisons, lists, features, advantages, steps
- Professional, comprehensive tone
- Detailed explanations with proper analysis"""

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

**CRITICAL FORMATTING INSTRUCTIONS:**

First, analyze the section title to determine the most suitable format:

1. **Use BULLET POINTS** (with <ul><li> HTML tags) when the section is:
   - A comparison (e.g., "Mitosis vs. Meiosis", "Comparison of...", "Differences between...")
   - A list of items (e.g., "Key Features", "Advantages", "Disadvantages", "Types of...")
   - Step-by-step process (e.g., "How to...", "Steps for...", "Process of...")
   - Summary or highlights (e.g., "Key Takeaways", "Summary", "Main Points")
   - Multiple distinct concepts that are better presented as separate points

2. **Use PARAGRAPHS** when the section is:
   - An introduction or overview
   - A narrative explanation
   - A detailed analysis requiring flowing prose
   - Background information or context

**OUTPUT FORMAT:**
- For bullet points: Use markdown unordered lists (- or *) which will be converted to HTML
- For paragraphs: Write natural paragraphs separated by blank lines
- You can mix both formats within the same section if appropriate
- Use **bold** for emphasis and *italic* for secondary emphasis
- Keep bullet points concise (1-2 sentences each)
- Make paragraphs flow naturally with proper transitions

Example bullet format:
- First key point here
- Second key point here
- Third key point here

Example paragraph format:
Regular paragraph text here with **bold** and *italic* formatting.

Another paragraph here.

REQUIREMENTS:
1. Stay within scope of "{title}" only
2. ANALYZE the section title and choose the appropriate format (bullets vs paragraphs)
3. Use markdown formatting (will be converted to HTML automatically)
4. Provide {word_count} words (±10%)
5. Include 3-5 summary bullets in the "bullets" field (these are separate from the main content)
6. High quality, professional content"""),
            ("user", "Generate content for the section '{title}' about '{topic}'. First determine if this section should use bullet points or paragraphs based on the title, then generate accordingly.")
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
        style_guidance = """STYLE FOR PRESENTATIONS:
- Maintain bullet point format (markdown: - or *)
- Keep bullets short and scannable
- Each bullet should be 1-2 sentences maximum""" if doc_type == "pptx" else """STYLE FOR DOCUMENTS:
- Maintain existing format unless user requests a change
- Professional, comprehensive tone
- Detailed and well-structured"""

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

**CRITICAL: YOU MUST FOLLOW USER INSTRUCTIONS EXACTLY**

When the user asks to:
- "Convert to bullet points" → Transform the content into markdown bullet format (- or *) with clear, concise bullet points
- "Make it a list" → Use markdown bullet format (- or *)
- "Use bullets" → Use markdown bullet format (- or *)
- "Return in points" → Use markdown bullet format (- or *)
- "Add more detail" → Expand paragraphs while maintaining format
- "Make it shorter" → Condense while maintaining format
- "Change format" → Follow their specific format request (bullets/paragraphs)

**FORMATTING RULES:**
- For bullet points: Use markdown unordered lists (- or *) which will be converted to HTML
- For paragraphs: Write natural paragraphs separated by blank lines
- Use **bold** for emphasis and *italic* for secondary emphasis
- Preserve current format unless user explicitly asks to change it
- If content is currently in bullets and user says "return in points", keep it as bullets
- If content is in paragraphs and user says "convert to bullets", change to markdown bullet format (- or *)

Example bullet format:
- First key point here
- Second key point here

Example paragraph format:
Regular paragraph text here with **bold** and *italic* formatting.

Another paragraph here.

REQUIREMENTS:
1. **OBEY user's instructions EXACTLY - this is mandatory**
2. If user specifies format (bullets/paragraphs), use that format
3. Preserve good aspects of current content unless asked to change them
4. Use markdown formatting (will be converted to HTML automatically)
5. Update the "bullets" field (3-5 summary points - these are separate from main content)
6. Provide brief diff_summary explaining what changed (1-2 sentences)"""),
            ("user", "Refine this content based on my instructions: {instructions}\n\nIMPORTANT: Follow my instructions precisely. If I ask for bullet points, use markdown bullet format (- or *). If I ask for paragraphs, use regular paragraph text. Do not ignore my formatting requests.")
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
