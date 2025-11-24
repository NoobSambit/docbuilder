"""
Test Google Custom Search API directly to diagnose issues
"""
import os
from dotenv import load_dotenv
import requests

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
CSE_ID = os.getenv("GOOGLE_CSE_ID")

print("="*60)
print("Testing Google Custom Search API")
print("="*60)
print(f"API Key: {API_KEY[:20]}... (truncated)")
print(f"CSE ID: {CSE_ID}")
print()

# Test direct API call
url = "https://www.googleapis.com/customsearch/v1"
params = {
    "key": API_KEY,
    "cx": CSE_ID,
    "q": "python programming",
    "num": 3
}

print("Making direct API call...")
print(f"URL: {url}")
print()

try:
    response = requests.get(url, params=params)
    print(f"Status Code: {response.status_code}")
    print()

    if response.status_code == 200:
        print("SUCCESS! API is working!")
        data = response.json()
        print(f"Found {len(data.get('items', []))} results")
        print()
        print("First result:")
        if data.get('items'):
            first = data['items'][0]
            print(f"  Title: {first.get('title')}")
            print(f"  Link: {first.get('link')}")
            print(f"  Snippet: {first.get('snippet')[:100]}...")
    else:
        print("ERROR! API call failed")
        print(f"Response: {response.text}")
        print()

        # Diagnose common issues
        if response.status_code == 403:
            print("DIAGNOSIS: 403 Forbidden")
            print()
            print("Possible causes:")
            print("1. API key has restrictions that block Custom Search API")
            print("   → Go to: https://console.cloud.google.com/apis/credentials")
            print("   → Click your API key")
            print("   → Set 'API restrictions' to 'Don't restrict key'")
            print("   → SAVE and wait 5 minutes")
            print()
            print("2. Custom Search API is not enabled")
            print("   → Go to: https://console.cloud.google.com/apis/library/customsearch.googleapis.com")
            print("   → Click ENABLE")
            print()
            print("3. Billing account might be required")
            print("   → Go to: https://console.cloud.google.com/billing")
            print("   → Link a billing account (free tier still free)")

        elif response.status_code == 400:
            print("DIAGNOSIS: 400 Bad Request")
            print("Your CSE ID might be incorrect or CSE is not configured properly")
            print("Go to: https://programmablesearchengine.google.com/controlpanel/all")
            print("Verify CSE ID and enable 'Search the entire web'")

        elif response.status_code == 429:
            print("DIAGNOSIS: 429 Too Many Requests")
            print("You've exceeded the free tier limit (100 queries/day)")
            print("Wait until tomorrow or upgrade to paid tier")

except Exception as e:
    print(f"EXCEPTION: {e}")
    import traceback
    traceback.print_exc()

print()
print("="*60)
