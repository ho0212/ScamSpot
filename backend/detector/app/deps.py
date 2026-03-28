import os
import joblib
from functools import lru_cache
from typing import Any

DEFAULT_MODEL_PATH = "spam_model.joblib"

@lru_cache()
def load_model() -> Any:
    model_path = os.getenv("MODEL_PATH", DEFAULT_MODEL_PATH)
    model = joblib.load(model_path)
    for attr in ("predict", "predict_proba"):
        if not hasattr(model, attr):
            raise RuntimeError(f"Loaded model missing required method: {attr}")
    return model

def get_model():
    return load_model()
