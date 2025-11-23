import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
if not firebase_admin._apps:
    service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if service_account_json:
        try:
            cred_dict = json.loads(service_account_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Error initializing Firebase from JSON: {e}")
    elif cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to default credentials (useful for Cloud Run)
        # or mock if testing
        try:
            firebase_admin.initialize_app()
        except Exception as e:
            print(f"Warning: Firebase init failed (might be expected in tests): {e}")

def get_db():
    try:
        return firestore.client()
    except Exception as e:
        print(f"Error getting firestore client: {e}")
        return None
