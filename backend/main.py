from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your sub-applications
from data_insight.main import app as data_insight_app
from detector.app.main import app as detector_app

# Create main app
app = FastAPI(title="Scam Analysis Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount sub-applications
app.mount("/data_insight", data_insight_app)
app.mount("/detector", detector_app)

# Health check endpoint
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "Scam Analysis Platform API"}

@app.get("/health")
def health():
    return {"status": "ok"}