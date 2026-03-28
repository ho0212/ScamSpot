# app.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

# Define input schema
class ScamInput(BaseModel):
    message: str

app = FastAPI()

# Load trained model
HERE = Path(__file__).resolve().parent
MODEL_PATH = HERE / "saved_model" / "message_scam_classifier.pkl"
saved = joblib.load(MODEL_PATH)pipeline = saved["pipeline"]
class_mapping = saved["class_mapping"]

@app.post("/predict")
def predict_scam(data: ScamInput, top_n: int = 5):
    # Transform message through pipeline up to TF-IDF
    # Extract the classifier and the TF-IDF vectorizer
    clf = pipeline.named_steps['clf']
    tfidf = pipeline.named_steps['features'].named_transformers_['text'].named_steps['tfidf']

    # Get prediction
    pred_class_idx = pipeline.predict([data.message])[0]
    pred_class_name = class_mapping[pred_class_idx]

    # Get class probabilities
    proba = pipeline.predict_proba([data.message])[0][pred_class_idx] # only for predicted class
    #proba_dict = {class_mapping[i]: round(float(p), 4) for i, p in enumerate(proba)}

    # Get TF-IDF feature vector for this message
    X_tfidf = tfidf.transform(pipeline.named_steps['features'].transform([data.message])[:,0])
    
    # Get feature names
    feature_names = np.array(tfidf.get_feature_names_out())
    
    # Get coefficients for the predicted class
    class_coef = clf.coef_[pred_class_idx]
    
    # Compute contribution (coef * TF-IDF value)
    contributions = X_tfidf.toarray()[0] * class_coef
    
    # Get top N contributing words
    top_idx = contributions.argsort()[::-1][:top_n]
    top_words = [(feature_names[i], round(contributions[i], 4)) for i in top_idx if contributions[i] != 0]

    return {
        "prediction": pred_class_name,
        "probability": round(float(proba), 4),
        "top_words": top_words
    }
