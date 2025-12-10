from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import os
import json
import uuid
from dotenv import load_dotenv

# LangChain imports
from langchain_groq import ChatGroq
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
    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0, use_rag: bool = False) -> Dict[str, Any]:
        pass

    @abstractmethod
    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None, section_position: int = 0, total_sections: int = 0, target_word_count: Optional[int] = None, previous_section_context: Optional[str] = None, next_section_context: Optional[str] = None) -> Dict[str, Any]:
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

    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0, use_rag: bool = False) -> Dict[str, Any]:
        return {
            "title": title,
            "text": f"This is the generated content for section '{title}' regarding '{topic}'. It is a mock response.",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "word_count": 25
        }

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None, section_position: int = 0, total_sections: int = 0, target_word_count: Optional[int] = None, previous_section_context: Optional[str] = None, next_section_context: Optional[str] = None) -> Dict[str, Any]:
        return {
            "text": f"Refined version of: {current_text[:20]}... based on '{instructions}'",
            "bullets": current_bullets or ["Refined Point 1", "Refined Point 2", "Refined Point 3"],
            "diff_summary": f"Applied changes based on: {instructions}"
        }

class GroqLLMAdapter(LLMAdapter):
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")

        # Initialize LangChain's ChatGroq with Llama 3.3 70B
        # This model offers excellent performance on Groq's free tier
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            groq_api_key=api_key,
            temperature=0.7,
            max_retries=3  # Built-in retry logic
        )

        # Initialize RAG retriever (lazy loaded)
        self._rag_retriever = None

    def _get_rag_retriever(self):
        """Lazy load RAG retriever"""
        if self._rag_retriever is None:
            from app.core.rag import get_rag_retriever
            self._rag_retriever = get_rag_retriever()
        return self._rag_retriever

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

    def generate_section(self, title: str, topic: str, word_count: int, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_position: int = 0, use_rag: bool = False) -> Dict[str, Any]:
        # Set up Pydantic output parser
        parser = PydanticOutputParser(pydantic_object=SectionContentSchema)

        # RAG: Retrieve web context if enabled
        rag_context = ""
        rag_metadata = {}
        if use_rag:
            try:
                retriever = self._get_rag_retriever()
                rag_result = retriever.get_relevant_context(
                    section_title=title,
                    topic=topic,
                    doc_type=doc_type,
                    top_k=5
                )
                if rag_result.get("context"):
                    rag_context = f"""

**WEB RESEARCH CONTEXT** (Use this information to enhance your content with factual, up-to-date details):

{rag_result['context']}

IMPORTANT: Incorporate insights from the above web research naturally into your content. Do NOT copy verbatim - synthesize and integrate the information.
"""
                    rag_metadata = {
                        "rag_enabled": True,
                        "sources": rag_result.get("sources", []),
                        "query": rag_result.get("query", ""),
                        "chunks_used": rag_result.get("chunks_used", 0)
                    }
                    print(f"[RAG] Retrieved {rag_result.get('chunks_used', 0)} relevant chunks for '{title}'")
            except Exception as e:
                print(f"[RAG Warning] Failed to retrieve context: {e}")
                rag_metadata = {"rag_enabled": False, "error": str(e)}

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
{rag_context}

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
                "style_guidance": style_guidance,
                "rag_context": rag_context
            })

            # Convert markdown to HTML for storage
            import markdown2
            result_dict = result.dict()
            result_dict['text'] = markdown2.markdown(result_dict['text'])

            # Add RAG metadata to response
            if rag_metadata:
                result_dict['rag_metadata'] = rag_metadata

            return result_dict
        except Exception as e:
            print(f"LangChain Error in generate_section: {e}")
            raise ValueError(f"Failed to generate section: {str(e)}")

    def refine_section(self, current_text: str, history: List[Dict[str, Any]], instructions: str, current_bullets: Optional[List[str]] = None, doc_title: Optional[str] = None, outline_context: Optional[List[str]] = None, doc_type: str = "docx", section_title: Optional[str] = None, section_position: int = 0, total_sections: int = 0, target_word_count: Optional[int] = None, previous_section_context: Optional[str] = None, next_section_context: Optional[str] = None) -> Dict[str, Any]:
        # Set up Pydantic output parser
        parser = PydanticOutputParser(pydantic_object=RefinementOutputSchema)

        # Keep the original HTML/markdown content for the prompt
        # Don't strip it - the LLM needs to see the formatting to understand structure
        # We'll use current_text as-is

        # Calculate current word count
        import html2text
        h2t = html2text.HTML2Text()
        h2t.ignore_links = False
        h2t.body_width = 0
        plain_text = h2t.handle(current_text) if '<' in current_text else current_text
        current_word_count = len(plain_text.split())

        # Build outline context with position marker
        outline_str = ""
        if outline_context:
            for idx, section_title_item in enumerate(outline_context, 1):
                marker = " ← YOU ARE HERE" if idx == section_position else ""
                outline_str += f"{idx}. {section_title_item}{marker}\n"

        # Build history context (last 7 refinements) with more detail
        history_str = ""
        if history:
            history_str = "PREVIOUS REFINEMENTS:\n"
            for idx, h in enumerate(history[-7:], 1):
                prompt_text = h.get('prompt', 'No prompt')
                diff = h.get('diff_summary', '')
                likes = len(h.get('likes', []))
                dislikes = len(h.get('dislikes', []))
                reaction = "✓" if likes > 0 else ("✗" if dislikes > 0 else "○")

                history_str += f"{idx}. {reaction} Request: \"{prompt_text}\"\n"
                if diff:
                    history_str += f"   Result: {diff}\n"

            history_str += "\nNOTE: ✓ = User liked, ✗ = User disliked, ○ = Neutral. Learn from past refinements.\n"

        # Style guidance
        style_guidance = """STYLE FOR PRESENTATIONS:
- Maintain bullet point format (markdown: - or *)
- Keep bullets short and scannable
- Each bullet should be 1-2 sentences maximum""" if doc_type == "pptx" else """STYLE FOR DOCUMENTS:
- Maintain existing format unless user requests a change
- Professional, comprehensive tone
- Detailed and well-structured"""

        # Determine word count instruction based on user request
        word_count_instruction = ""
        instructions_lower = instructions.lower()
        if "expand" in instructions_lower or "longer" in instructions_lower or "add more" in instructions_lower:
            suggested_target = int(current_word_count * 1.3)
            word_count_instruction = f"Expand to approximately {suggested_target} words (+30%)"
        elif "shorter" in instructions_lower or "condense" in instructions_lower or "reduce" in instructions_lower:
            suggested_target = int(current_word_count * 0.7)
            word_count_instruction = f"Reduce to approximately {suggested_target} words (-30%)"
        elif target_word_count:
            word_count_instruction = f"Adjust to target: {target_word_count} words"
        else:
            word_count_instruction = f"Maintain approximately {current_word_count} words"

        # Create LangChain prompt template with XML structure
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert content editor. {format_instructions}

<document_context>
Title: {doc_title}
Type: {doc_type}
Total Sections: {total_sections}
</document_context>

<current_section>
Position: {section_position} of {total_sections}
Title: {section_title}
Current Word Count: {current_word_count} words
Target Word Count: {target_word_count}
</current_section>

<document_outline>
{outline_str}
</document_outline>

<adjacent_sections>
{adjacent_context}
</adjacent_sections>

<current_content>
{current_text}
</current_content>

<summary_bullets>
{current_bullets}
</summary_bullets>

<refinement_history>
{history_str}
</refinement_history>

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
            ("user", """<user_instructions>
{instructions}
</user_instructions>

<success_criteria>
1. Follow the user's instructions precisely
2. {word_count_instruction}
3. Maintain document flow with adjacent sections
4. Keep consistent with overall document theme
5. Preserve or enhance key points from current bullets
</success_criteria>

IMPORTANT: If the user asks for transitions, use the adjacent section context to create smooth connections. If they ask to expand/condense, follow the word count target above.""")
        ])

        # Build the LangChain chain
        chain = prompt_template | self.llm | parser

        # Execute the chain
        try:
            # Convert HTML to markdown for better LLM understanding
            h = html2text.HTML2Text()
            h.ignore_links = False
            h.body_width = 0  # Don't wrap lines

            # Convert HTML to markdown (preserves structure)
            if '<' in current_text:
                markdown_text = h.handle(current_text)
            else:
                markdown_text = current_text

            # Build adjacent sections context
            adjacent_context = ""
            if previous_section_context:
                adjacent_context += f"Previous Section:\n{previous_section_context}\n\n"
            if next_section_context:
                adjacent_context += f"Next Section:\n{next_section_context}"
            if not adjacent_context:
                adjacent_context = "N/A (first or last section, or context not available)"

            result = chain.invoke({
                "format_instructions": parser.get_format_instructions(),
                "doc_title": doc_title or "Document",
                "section_title": section_title or "Section",
                "doc_type": doc_type.upper(),
                "total_sections": total_sections,
                "section_position": section_position,
                "current_word_count": current_word_count,
                "target_word_count": target_word_count or "Not specified",
                "outline_str": outline_str or "Outline not available",
                "adjacent_context": adjacent_context,
                "current_text": markdown_text,  # Full content in markdown format
                "current_bullets": "\n".join(f"• {b}" for b in (current_bullets or [])),
                "history_str": history_str or "First refinement - no previous history",
                "style_guidance": style_guidance,
                "word_count_instruction": word_count_instruction,
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
    if provider == "groq":
        return GroqLLMAdapter()
    return MockLLMAdapter()
