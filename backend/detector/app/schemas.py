from pydantic import BaseModel, Field, constr
from typing import List, Optional

TextStr = constr(strip_whitespace=True, min_length=1)

class PredictRequest(BaseModel):
    text: TextStr = Field(..., description="SMS or email body")

class TopWord(BaseModel):
    word: str
    contribution: float

class PredictResponse(BaseModel):
    label: str              # "Ham/Legitimate", Scam" 
    confidence: float       # Probability of prediction
    top_words: List[TopWord]
    context: str            #SMS or email
    summary: Optional[str] = None   # Plain-text LLM summary