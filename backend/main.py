from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Doc Builder API")

# CORS
origins = [
    "http://localhost:3000",
    "https://docbuilder-pearl.vercel.app", # Example
]

# Add origins from environment variable
cors_env = os.getenv("CORS_ORIGINS")
if cors_env:
    origins.extend([origin.strip().rstrip("/") for origin in cors_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(endpoints.router)

@app.get("/")
async def root():
    """Root endpoint - API is running"""
    return {"message": "DocBuilder API is running", "docs": "/docs"}

@app.head("/health")
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring services like UptimeRobot.
    Supports both GET and HEAD methods.
    Returns 200 OK to prevent cold starts on Render free tier.
    """
    return {
        "status": "healthy",
        "service": "docbuilder-backend",
        "timestamp": os.getenv("RENDER_GIT_COMMIT", "local")[:7] if os.getenv("RENDER_GIT_COMMIT") else "local"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
