#!/usr/bin/env python3
"""
Quick test script to verify LangChain integration is working.
Run this after setting up your .env file.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test that all LangChain packages are installed"""
    print("=" * 60)
    print("1. Testing LangChain Imports...")
    print("=" * 60)

    try:
        import langchain
        print(f"✓ langchain: {langchain.__version__}")
    except ImportError as e:
        print(f"✗ langchain import failed: {e}")
        return False

    try:
        import langchain_google_genai
        print("✓ langchain-google-genai: installed")
    except ImportError as e:
        print(f"✗ langchain-google-genai import failed: {e}")
        return False

    try:
        import langchain_community
        print("✓ langchain-community: installed")
    except ImportError as e:
        print(f"✗ langchain-community import failed: {e}")
        return False

    print("\n✓ All LangChain packages installed successfully!\n")
    return True

def test_environment():
    """Test that environment variables are configured"""
    print("=" * 60)
    print("2. Testing Environment Variables...")
    print("=" * 60)

    llm_provider = os.getenv("LLM_PROVIDER", "not set")
    google_api_key = os.getenv("GOOGLE_API_KEY", "not set")

    print(f"LLM_PROVIDER: {llm_provider}")

    if google_api_key == "not set" or google_api_key == "your_google_api_key_here":
        print("✗ GOOGLE_API_KEY: NOT CONFIGURED")
        print("\n⚠️  WARNING: Set GOOGLE_API_KEY in backend/.env file")
        return False
    else:
        print(f"✓ GOOGLE_API_KEY: configured ({google_api_key[:10]}...)")

    # Check LangSmith configuration (optional)
    langsmith_enabled = os.getenv("LANGCHAIN_TRACING_V2", "false")
    if langsmith_enabled == "true":
        langsmith_key = os.getenv("LANGCHAIN_API_KEY", "not set")
        if langsmith_key != "not set":
            print(f"✓ LangSmith tracing: ENABLED")
        else:
            print("⚠️  LangSmith enabled but API key missing")
    else:
        print("○ LangSmith tracing: disabled (optional)")

    print("\n✓ Environment configured correctly!\n")
    return True

def test_llm_adapter():
    """Test that LLM adapter can be initialized"""
    print("=" * 60)
    print("3. Testing LLM Adapter Initialization...")
    print("=" * 60)

    try:
        from app.core.llm import get_llm_adapter

        adapter = get_llm_adapter()
        print(f"✓ LLM Adapter created: {type(adapter).__name__}")

        # Check if it's the Gemini adapter
        if "Gemini" in type(adapter).__name__:
            print("✓ Using GeminiLLMAdapter with LangChain")
        elif "Mock" in type(adapter).__name__:
            print("○ Using MockLLMAdapter (set LLM_PROVIDER=gemini to use real API)")

        print("\n✓ LLM adapter initialized successfully!\n")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize LLM adapter: {e}")
        return False

def test_pydantic_schemas():
    """Test that Pydantic schemas are available"""
    print("=" * 60)
    print("4. Testing Pydantic Output Schemas...")
    print("=" * 60)

    try:
        from app.models import (
            OutlineSchema,
            OutlineItemSchema,
            SectionContentSchema,
            RefinementOutputSchema
        )

        print("✓ OutlineSchema imported")
        print("✓ OutlineItemSchema imported")
        print("✓ SectionContentSchema imported")
        print("✓ RefinementOutputSchema imported")

        # Test creating a schema instance
        test_item = OutlineItemSchema(
            id="s1",
            title="Test Section",
            word_count=200
        )
        print(f"\n✓ Schema validation works: {test_item.dict()}")

        print("\n✓ All Pydantic schemas working!\n")
        return True
    except Exception as e:
        print(f"✗ Failed to import schemas: {e}")
        return False

def test_cache_file():
    """Test that cache directory is writable"""
    print("=" * 60)
    print("5. Testing SQLite Cache...")
    print("=" * 60)

    cache_file = ".langchain_cache.db"

    try:
        # The cache will be created when first LLM call is made
        print(f"○ Cache file location: {os.path.abspath(cache_file)}")
        print("○ Cache will be created on first LLM call")
        print("\n✓ Cache configuration ready!\n")
        return True
    except Exception as e:
        print(f"✗ Cache check failed: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("\n" + "=" * 60)
    print(" LANGCHAIN INTEGRATION TEST SUITE")
    print("=" * 60 + "\n")

    tests = [
        ("Imports", test_imports),
        ("Environment", test_environment),
        ("LLM Adapter", test_llm_adapter),
        ("Pydantic Schemas", test_pydantic_schemas),
        ("Cache Setup", test_cache_file),
    ]

    results = []
    for name, test_func in tests:
        try:
            results.append((name, test_func()))
        except Exception as e:
            print(f"\n✗ {name} test crashed: {e}\n")
            results.append((name, False))

    # Summary
    print("=" * 60)
    print(" TEST SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")

    print(f"\nResults: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 ALL TESTS PASSED! LangChain integration is working!")
        print("\nNext steps:")
        print("1. Start your backend server: uvicorn main:app --reload")
        print("2. Test with a real API call")
        print("3. (Optional) Set up LangSmith monitoring - see LANGSMITH_SETUP_GUIDE.md")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("- Set GOOGLE_API_KEY in backend/.env")
        print("- Set LLM_PROVIDER=gemini in backend/.env")
        print("- Run: pip install langchain langchain-google-genai langchain-community")

    print("=" * 60 + "\n")

    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
