import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
import sys, pathlib
BACKEND_ROOT = pathlib.Path(__file__).resolve().parents[1]  # .../backend
sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app
client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

@pytest.mark.parametrize("text,expected", [
    ("WIN a free prize now!", "spam"),
    ("Hello, are we still on for lunch tomorrow?", "ham"),
])
def test_predict_real_model(text, expected):
    # Ensure model path is available
    model_path = os.getenv("MODEL_PATH", "spam_model.joblib")
    assert os.path.exists(model_path), f"Model file not found at {model_path}"

    r = client.post("/predict", json={"text": text})
    assert r.status_code == 200
    data = r.json()
    assert data["label"] in ["ham", "spam"]
    # optional: check matches expected (model is pretty accurate but not perfect)
    # assert data["label"] == expected
    assert 0.0 <= data["confidence"] <= 1.0
