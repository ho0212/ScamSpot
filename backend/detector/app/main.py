# app/main.py
import os
import re
from pathlib import Path
from typing import List, Tuple, Annotated

import joblib
import nltk
import numpy as np
from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from lime.lime_text import LimeTextExplainer
from sklearn.base import BaseEstimator, TransformerMixin
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

# from app.schemas import PredictRequest, PredictResponse, TopWord
from .schemas import PredictRequest, PredictResponse, TopWord
from .llm_summary import explain_summary

# --- Optional: load .env in local/dev. On EB, set env vars in the environment. ---
try:
    from dotenv import load_dotenv
    ROOT = Path(__file__).resolve().parents[2]  # two dirs up from app/main.py
    load_dotenv(ROOT / ".env", override=False)
except Exception:
    pass

DEBUG = os.getenv("LLM_DEBUG", "0") == "1"

app = FastAPI(title="Spot-Scam API", version="0.1.0")

@app.get("/_envcheck")
def _envcheck():
    k = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    return {
        "key_present": bool(k),
        "startswith_AIZa": k.startswith("AIza"),
        "model": os.getenv("GEMINI_MODEL"),
        "llm_debug": os.getenv("LLM_DEBUG"),
    }

@app.get("/_llm_diag")
def _llm_diag():
    # Minimal, non-sensitive connectivity probe
    from app.llm_summary import _get_client  # uses your cached builder
    info = {}
    try:
        c = _get_client()
        info["client_present"] = c is not None
        if c:
            r = c.models.generate_content(
                model=os.getenv("GEMINI_MODEL") or "gemini-2.5-flash",
                contents="ping",
            )
            info["resp_has_text"] = bool((getattr(r, "text", "") or "").strip())
    except Exception as e:
        info["error"] = repr(e)
    return info

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://scamspot.page",
        "https://www.scamspot.page",
        "https://ScamDetector-env.eba-w3dtmyy3.ap-southeast-2.elasticbeanstalk.com",
        "http://localhost:5173",    # Vite dev
        "http://localhost:3000",    # Next/create-react-app dev (if you use it)
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# ------------------------
# Shim for pickled TextPreprocessor
# ------------------------
try:
    from nltk.stem import WordNetLemmatizer
    from nltk.corpus import stopwords
    from nltk.tokenize import wordpunct_tokenize  # <= fallback that needs no NLTK data

    _lemmatizer = WordNetLemmatizer()
    try:
        _stop_words = set(stopwords.words("english"))  # may raise LookupError on EB
    except Exception:
        # Safe minimal fallback; you can expand this list if you like
        _stop_words = {
            "a","an","the","and","or","but","if","to","from","in","on","for","of",
            "with","at","by","is","it","this","that","these","those","as","are","be"
        }

    def _clean_and_lemmatize(text: str) -> str:
        text = text.lower()
        text = re.sub(r"\n", " ", text)
        text = re.sub(r"https?://\S+", "url", text)
        text = re.sub(r"\d{5,}", "number", text)
        text = re.sub(r"[^a-z0-9£$€\s]", "", text)
        try:
            tokens = nltk.word_tokenize(text)  # uses 'punkt' if present
        except LookupError:
            tokens = wordpunct_tokenize(text)  # clean fallback; no downloads needed
        # filter stopwords then lemmatize
        tokens = [_lemmatizer.lemmatize(t) for t in tokens if t not in _stop_words]
        return " ".join(tokens)

except Exception:
    # Fallback if NLTK isn't available at all
    def _clean_and_lemmatize(text: str) -> str:
        text = text.lower()
        text = re.sub(r"\n", " ", text)
        text = re.sub(r"https?://\S+", "url", text)
        text = re.sub(r"\d{5,}", "number", text)
        text = re.sub(r"[^a-z0-9£$€\s]", "", text)
        return text

class TextPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None): return self
    def transform(self, X):   return [_clean_and_lemmatize(t) for t in X]

import __main__
setattr(__main__, "TextPreprocessor", TextPreprocessor)
# ------------------------

def _confidence_for_pred(pipeline, pred_raw, probas) -> float:
    """Return P(pred_raw | x) by aligning to clf.classes_; fallback to max(probas)."""
    try:
        clf = pipeline.named_steps['clf']
        classes = getattr(clf, 'classes_', None)
        if classes is not None:
            classes = np.array(classes)
            idx = np.where(classes == pred_raw)[0][0]  # raises if not found
            return float(probas[idx])
    except Exception:
        pass
    return float(np.max(probas))


# Model paths
HERE = Path(__file__).resolve().parent        # app
MODEL_DIR = HERE / "saved_model"

BIN_PATH   = os.getenv("MODEL_PATH_ROUTER", str(MODEL_DIR / "context_binary_classifier.pkl"))
SMS_PATH   = os.getenv("MODEL_PATH_SMS",    str(MODEL_DIR / "message_scam_classifier.joblib"))
EMAIL_PATH = os.getenv("MODEL_PATH_EMAIL",  str(MODEL_DIR / "email_fraud_classifier_v2.joblib"))

# Globals
binary_pipeline = None
binary_class_mapping = None
sms_pipeline = None
sms_class_mapping = None
email_pipeline = None
email_class_mapping = None

def load_models_once():
    global binary_pipeline, binary_class_mapping, sms_pipeline, sms_class_mapping, email_pipeline, email_class_mapping
    if binary_pipeline is not None:
        return
    # Load Binary (Router)
    binary_saved = joblib.load(BIN_PATH)
    binary_pipeline = binary_saved["pipeline"]
    binary_class_mapping = binary_saved["class_mapping"]
    # Load SMS & Email
    sms_saved = joblib.load(SMS_PATH)
    sms_pipeline = sms_saved["pipeline"]
    sms_class_mapping = sms_saved["class_mapping"]
    email_saved = joblib.load(EMAIL_PATH)
    email_pipeline = email_saved["pipeline"]
    email_class_mapping = email_saved["class_mapping"]

# LIME explainer for email classes (build lazily once models are loaded)
email_explainer = None


def _get_email_explainer():
    global email_explainer
    if email_explainer is None:
        # Build names from loaded mapping (values -> human labels)
        class_names = list(email_class_mapping.values())
        # Defensive default if something failed to load
        if not class_names:
            class_names = ["not_fraud", "fraud"]
        # Larger num_features at explain time; class_names only needed here
        from lime.lime_text import LimeTextExplainer
        email_explainer = LimeTextExplainer(class_names=class_names)
    return email_explainer


def predict_with_pipeline_sms(pipeline, class_mapping, message: str, top_n: int = 5):
    pred_raw = pipeline.predict([message])[0]
    probas = pipeline.predict_proba([message])[0]
    confidence = _confidence_for_pred(pipeline, pred_raw, probas)

    pred_name = class_mapping[pred_raw] if isinstance(class_mapping, dict) else class_mapping[pred_raw]

    preprocess = pipeline.named_steps.get('preprocess')
    tfidf = pipeline.named_steps['tfidf']
    clf = pipeline.named_steps['clf']

    cleaned = preprocess.transform([message]) if preprocess is not None else [message]
    X = tfidf.transform(cleaned)                        # (1, n_features)
    feature_names = np.array(tfidf.get_feature_names_out())

    # Handle binary vs multiclass safely
    coefs = clf.coef_
    if coefs.ndim == 1:
        coefs = coefs.reshape(1, -1)
    classes = clf.classes_

    if coefs.shape[0] == 1:
        coef_row = coefs[0].copy()
        if pred_raw == classes[0]:
            coef_row = -coef_row
    else:
        idx = int(np.where(classes == pred_raw)[0][0])
        coef_row = coefs[idx]

    contrib = X.toarray()[0] * coef_row
    top_idx = np.argsort(contrib)[::-1]
    top_pairs = [(feature_names[i], float(contrib[i])) for i in top_idx if contrib[i] > 0][:top_n]

    return pred_name, round(float(confidence), 4), top_pairs


def predict_with_pipeline_email(pipeline, class_mapping, message: str, top_n: int = 5) -> Tuple[str, float, List[Tuple[str, float]]]:
    pred_raw = pipeline.predict([message])[0]
    probas = pipeline.predict_proba([message])[0]
    confidence = _confidence_for_pred(pipeline, pred_raw, probas)
    pred_class = class_mapping[pred_raw]

    # LIME explanation
    top_words: List[Tuple[str, float]] = []
    try:
        explainer = _get_email_explainer()
        exp = explainer.explain_instance(message, pipeline.predict_proba, num_features=top_n, num_samples=2000)
        top_words = [(word, float(weight)) for word, weight in exp.as_list()[:top_n]]
    except Exception:
        top_words = []

    return pred_class, round(confidence, 4), top_words


# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"error": "Too many requests. Please try again later."})


# --- Debug endpoints (only when LLM_DEBUG=1) ---
if DEBUG:
    @app.get("/debug/llm")
    def debug_llm():
        key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
        return {
            "key_present": bool(key),
            "key_startswith_AIZa": key.startswith("AIza"),
            "model": os.getenv("GEMINI_MODEL"),
        }

    @app.get("/debug/llm_try")
    def debug_llm_try():
        txt = explain_summary(
            text="WINNER! You have won a prize, click this link now http://scam.com",
            label="scam",
            confidence=0.97,
            top_tokens=["winner", "prize", "click", "link"],
        )
        return {"summary": txt}


@app.post("/predict", response_model=PredictResponse)
@limiter.limit("15/minute")
def predict(request: Request, payload: PredictRequest = Body(...)):
    text = payload.text
    try:
        load_models_once()

        # Router: 0 = Email, 1 = SMS (per your training)
        context_idx = binary_pipeline.predict([payload.text])[0]
        context = binary_class_mapping[context_idx]  # "Email" or "SMS"

        if context == "SMS":
            pred, confidence, pairs = predict_with_pipeline_sms(
                sms_pipeline, sms_class_mapping, payload.text
            )
        else:
            pred, confidence, pairs = predict_with_pipeline_email(
                email_pipeline, email_class_mapping, payload.text
            )

        # Use extracted words for LLM
        top_tokens = [w for (w, _c) in pairs]

        summary_text = explain_summary(
            text=payload.text,
            label=pred,
            confidence=confidence,
            top_tokens=top_tokens,
        )

        # Never return a blank summary to the client
        if summary_text is None:
            summary_text = "No additional explanation available."

        return PredictResponse(
            label=pred,
            confidence=confidence,
            top_words=[TopWord(word=w, contribution=c) for (w, c) in pairs],
            context=context,
            summary=summary_text,
        )
    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")
