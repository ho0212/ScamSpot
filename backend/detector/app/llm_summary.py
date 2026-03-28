# app/llm_summary.py
from __future__ import annotations
import os
from typing import Optional, List
from functools import lru_cache

from google import genai

DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"]
DEBUG = os.getenv("LLM_DEBUG", "0") == "1"

def _log(*a):
    if DEBUG:
        print("[LLM]", *a)

def _sanitize_key(key: str) -> str:
    key = (key or "").strip()
    if key.startswith("echo "):  # common copy/paste oops
        key = key[5:]
    return key

@lru_cache(maxsize=2)
def _build_client(key: str) -> Optional[genai.Client]:
    key = _sanitize_key(key)
    _log("build_client: key_present=", bool(key))
    return genai.Client(api_key=key) if key else None

def _get_client() -> Optional[genai.Client]:
    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    return _build_client(key)

def _first_nonempty_text(resp) -> str:
    # Works across SDK versions; .text may be empty even with candidates present
    txt = (getattr(resp, "text", "") or "").strip()
    if txt:
        return txt
    for cand in getattr(resp, "candidates", []) or []:
        content = getattr(cand, "content", None)
        parts = getattr(content, "parts", []) if content else []
        for part in parts or []:
            t = getattr(part, "text", "") or ""
            if t.strip():
                return t.strip()
    return ""

def explain_summary(
    *,
    text: str,
    label: str,
    confidence: float,
    top_tokens: Optional[List[str]] = None,
    model: str = DEFAULT_MODEL,
    # keep these args for future use; we won't pass them to the SDK right now
    timeout_s: float = 12.0,
    temperature: float = 0.2,
) -> Optional[str]:
    """
    Return a short explanation or None. Uses the simplest, most compatible call.
    Tries the provided model, then fallbacks.
    """
    client = _get_client()
    if client is None:
        _log("no client (missing API key?)")
        return None

    top_tokens = top_tokens or []
    prompt = (
        "Summarise in 2 short sentences using plain, non-technical language, "
        "why this message may be a scam (or not) based ONLY on the info below.\n\n"
        f"Label: {label}\nConfidence: {confidence:.2f}\n"
        f"Top tokens: {', '.join(top_tokens[:8]) or '—'}\n\n"
        f"Message:\n{text[:2000]}"
    )

    tried = []
    candidates = [model] + [m for m in FALLBACK_MODELS if m != model]

    for m in candidates:
        try:
            _log("calling model=", m, "prompt_len=", len(prompt))
            # **No config, no safety settings** — simplest path accepted by all recent versions
            resp = client.models.generate_content(model=m, contents=prompt)
            out = _first_nonempty_text(resp)
            if out:
                _log("resp_len=", len(out))
                return out
            _log("empty text from model", m)
        except Exception as e:
            _log(f"error with model {m}:", repr(e))
        tried.append(m)

    _log("all models failed/empty. tried=", tried)
    return None
