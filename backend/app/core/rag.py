"""
RAG (Retrieval-Augmented Generation) Module with Web Search

This module provides real-time web search capabilities to enhance content generation
with up-to-date, domain-specific information.
"""

from typing import List, Dict, Any, Optional
import os
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Use correct non-deprecated imports
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    # Fallback for older versions
    from langchain_community.embeddings import HuggingFaceEmbeddings

try:
    from langchain_google_community import GoogleSearchAPIWrapper
except ImportError:
    # Fallback for older versions
    from langchain_community.utilities import GoogleSearchAPIWrapper
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()


class WebSearchRetriever:
    """
    Retrieves and processes web search results for RAG.
    Uses Google Search API and HuggingFace embeddings for semantic search.
    """

    def __init__(self):
        """Initialize web search retriever with embeddings"""
        # Use lightweight HuggingFace embeddings (no API key needed)
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )

        # Text splitter for chunking web content
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100,
            length_function=len,
        )

        # Initialize Google Search (requires GOOGLE_API_KEY and GOOGLE_CSE_ID)
        google_api_key = os.getenv("GOOGLE_API_KEY")
        google_cse_id = os.getenv("GOOGLE_CSE_ID")

        self.search_enabled = bool(google_api_key and google_cse_id)

        if self.search_enabled:
            print(f"[RAG Init] Google Search API enabled")
            print(f"[RAG Init] API Key: {google_api_key[:20]}... (truncated)")
            print(f"[RAG Init] CSE ID: {google_cse_id}")
            try:
                self.search = GoogleSearchAPIWrapper(
                    google_api_key=google_api_key,
                    google_cse_id=google_cse_id,
                    k=5  # Number of results
                )
                print("[RAG Init] GoogleSearchAPIWrapper initialized successfully")
            except Exception as e:
                print(f"[RAG Init ERROR] Failed to initialize GoogleSearchAPIWrapper: {e}")
                self.search_enabled = False
        else:
            print("[RAG Init] Warning: Google Search API credentials not found. RAG will use mock data.")
            print(f"[RAG Init] GOOGLE_API_KEY present: {bool(google_api_key)}")
            print(f"[RAG Init] GOOGLE_CSE_ID present: {bool(google_cse_id)}")

    def formulate_search_query(self, section_title: str, topic: str, doc_type: str = "docx") -> str:
        """
        Generate an optimized search query from section context.

        Args:
            section_title: The section being generated (e.g., "Comparative Analysis: Mitosis vs. Meiosis")
            topic: The document topic
            doc_type: Type of document (docx/pptx)

        Returns:
            Optimized search query string
        """
        # Remove common filler words
        query_parts = []

        # Extract key terms from section title
        title_lower = section_title.lower()

        # Skip generic words
        skip_words = {'section', 'chapter', 'introduction', 'conclusion', 'overview', 'analysis'}
        title_words = [word for word in title_lower.split() if word not in skip_words and len(word) > 3]

        if title_words:
            query_parts.extend(title_words[:5])  # Limit to 5 key words

        # Add topic context
        query_parts.append(topic.lower())

        # Join and clean
        query = " ".join(query_parts)
        query = query.replace(":", "").replace(",", "")

        return query[:100]  # Google search query limit

    def fetch_web_content(self, url: str, timeout: int = 5) -> str:
        """
        Fetch and extract text content from a web page.

        Args:
            url: The URL to fetch
            timeout: Request timeout in seconds

        Returns:
            Extracted text content
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            # Get text
            text = soup.get_text(separator='\n', strip=True)

            # Clean up whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = '\n'.join(lines)

            return text[:5000]  # Limit to 5000 chars per page

        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return ""

    def search_and_retrieve(
        self,
        query: str,
        num_results: int = 5
    ) -> List[Document]:
        """
        Perform web search and retrieve content from top results.

        Args:
            query: Search query string
            num_results: Number of search results to fetch

        Returns:
            List of Document objects with retrieved content
        """
        documents = []

        if not self.search_enabled:
            # Mock data for development/testing
            print(f"[RAG Mock] Would search for: {query}")
            return [
                Document(
                    page_content=f"Mock research content about {query}. This is placeholder data for testing. "
                    f"In a real scenario, this would contain actual web search results with relevant information.",
                    metadata={"source": "mock", "title": f"Mock Result for: {query}"}
                )
            ]

        try:
            print(f"[RAG] Searching Google for: {query}")

            # Perform Google search
            search_results = self.search.results(query, num_results=num_results)
            print(f"[RAG] Google returned {len(search_results) if search_results else 0} results")

            if not search_results:
                print("[RAG] No search results returned - using mock data")
                return [
                    Document(
                        page_content=f"Mock research content about {query}. No real search results available.",
                        metadata={"source": "mock", "title": "Fallback Mock Result"}
                    )
                ]

            for idx, result in enumerate(search_results, 1):
                url = result.get('link', '')
                title = result.get('title', 'Untitled')
                snippet = result.get('snippet', '')

                print(f"[RAG] Processing result {idx}: {title[:50]}...")

                # Fetch full page content
                content = self.fetch_web_content(url)

                if content:
                    documents.append(Document(
                        page_content=content,
                        metadata={
                            "source": url,
                            "title": title,
                            "snippet": snippet
                        }
                    ))
                    print(f"[RAG] Successfully fetched content from {url[:50]}...")
                else:
                    print(f"[RAG] Failed to fetch content from {url[:50]}...")

            print(f"[RAG] Retrieved {len(documents)} documents for query: {query}")

        except Exception as e:
            import traceback
            print(f"[RAG Error] Search failed: {e}")
            print(f"[RAG Error] Traceback: {traceback.format_exc()}")
            # Return mock data on error instead of empty list
            return [
                Document(
                    page_content=f"Fallback mock content about {query} due to search error.",
                    metadata={"source": "mock-error", "title": "Error Fallback"}
                )
            ]

        return documents

    def get_relevant_context(
        self,
        section_title: str,
        topic: str,
        doc_type: str = "docx",
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Main RAG method: Search, retrieve, embed, and find relevant context.

        Args:
            section_title: Section being generated
            topic: Document topic
            doc_type: Document type (docx/pptx)
            top_k: Number of most relevant chunks to return

        Returns:
            Dictionary with context and metadata
        """
        # Step 1: Formulate search query
        search_query = self.formulate_search_query(section_title, topic, doc_type)

        # Step 2: Search and retrieve documents
        documents = self.search_and_retrieve(search_query, num_results=5)

        if not documents:
            return {
                "context": "",
                "sources": [],
                "query": search_query,
                "chunks_used": 0
            }

        # Step 3: Split documents into chunks
        chunks = self.text_splitter.split_documents(documents)

        if not chunks:
            return {
                "context": "",
                "sources": [],
                "query": search_query,
                "chunks_used": 0
            }

        # Step 4: Create vector store and perform similarity search
        try:
            vectorstore = FAISS.from_documents(chunks, self.embeddings)

            # Search for most relevant chunks
            relevant_chunks = vectorstore.similarity_search(
                f"{section_title} {topic}",
                k=min(top_k, len(chunks))
            )

            # Step 5: Compile context
            context_parts = []
            sources = []

            for i, chunk in enumerate(relevant_chunks, 1):
                context_parts.append(f"[Source {i}]\n{chunk.page_content}\n")
                sources.append({
                    "url": chunk.metadata.get("source", "Unknown"),
                    "title": chunk.metadata.get("title", "Untitled")
                })

            context = "\n".join(context_parts)

            return {
                "context": context,
                "sources": sources,
                "query": search_query,
                "chunks_used": len(relevant_chunks)
            }

        except Exception as e:
            print(f"[RAG Error] Vector search failed: {e}")
            return {
                "context": "",
                "sources": [],
                "query": search_query,
                "chunks_used": 0
            }


# Singleton instance
_retriever_instance = None


def get_rag_retriever() -> WebSearchRetriever:
    """Get or create singleton RAG retriever instance"""
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = WebSearchRetriever()
    return _retriever_instance
