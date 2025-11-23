import os
import json
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
print(f"Reading .env from: {env_path}")
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        content = f.read()
        print(f"File content length: {len(content)}")
        print("--- Content Start ---")
        print(content)
        print("--- Content End ---")
else:
    print("❌ .env file not found!")

load_dotenv(env_path)

def verify_firebase_setup():
    print("Verifying Firebase Setup...")
    
    # Check for GOOGLE_SERVICE_ACCOUNT_JSON
    json_env = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not json_env:
        print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found in environment.")
        return

    print("✅ GOOGLE_SERVICE_ACCOUNT_JSON found.")
    
    try:
        # Try to parse JSON
        cred_dict = json.loads(json_env)
        print("✅ JSON parsed successfully.")
        
        # Try to create credentials object
        cred = credentials.Certificate(cred_dict)
        print("✅ Credentials object created successfully.")
        
        # Try to initialize app (dry run)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized successfully.")
        else:
            print("ℹ️ Firebase Admin already initialized.")
            
    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")

if __name__ == "__main__":
    verify_firebase_setup()
