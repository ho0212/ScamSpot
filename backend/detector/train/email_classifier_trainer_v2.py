import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report
from imblearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from sklearn.base import BaseEstimator, TransformerMixin
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
import joblib
import re
import os
from dotenv import load_dotenv

# Database connection details
load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Dataset folder path
DATASET_PATH = os.getenv('DATASET_PATH')

# Create the connection engine
DATABASE_URL = f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# Download NLTK resources
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

# Text preprocessing
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def clean_and_lemmatize(text):
    text = text.lower()
    text = re.sub(r'\n', ' ', text)  # remove newlines
    text = re.sub(r'https?://\S+', 'url', text)  # replace URLs with 'url'
    text = re.sub(r'\d{5,}', 'number', text)  # replace long numbers with 'number'
    text = re.sub(r'[^a-z0-9£$€\s]', '', text)  # keep letters, numbers, currency symbols, spaces
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    return ' '.join(tokens)

# Custom transformer for text cleaning
class TextPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        return [clean_and_lemmatize(text) for text in X]

# Main Trainer Class
class EmailFraudClassifierTrainer:
    def __init__(self, connection_string, model_path="saved_model/email_fraud_classifier_v2.joblib"):
        self.connection_string = connection_string
        self.model_path = model_path

        # Map labels for readability
        self.class_mapping = {0: "legitimate", 1: "scam"}

        # Define pipeline with MLP
        self.pipeline = Pipeline([
            ('preprocess', TextPreprocessor()),
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=5000)),  # uni+bi-grams
            ('clf', MLPClassifier(
                hidden_layer_sizes=(256, 128, 64),  # 3 layers: 256 → 128 → 64
                activation='relu',
                solver='adam',
                max_iter=500,
                learning_rate_init=0.001,
                random_state=42,
                early_stopping=True,
                verbose=True
            ))
        ])

    def load_data(self, query="SELECT content AS text, class AS label FROM email_detection_dataset"):
        engine = create_engine(self.connection_string)
        df = pd.read_sql(query, engine)
        return df

    def train(self, df):
        X = df['text']
        y = df['label']

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Train pipeline
        self.pipeline.fit(X_train, y_train)

        # Evaluate
        y_pred = self.pipeline.predict(X_test)
        y_test_labels = [self.class_mapping[label] for label in y_test]
        y_pred_labels = [self.class_mapping[label] for label in y_pred]

        print(classification_report(
            y_test_labels, y_pred_labels, target_names=list(self.class_mapping.values())
        ))

    def save_model(self):
        joblib.dump({
            "pipeline": self.pipeline,
            "class_mapping": self.class_mapping
        }, self.model_path)
        print(f"Model and class mapping saved to {self.model_path}")


# Train
if __name__ == "__main__":
    trainer = EmailFraudClassifierTrainer(DATABASE_URL)
    df = trainer.load_data()
    trainer.train(df)
    trainer.save_model()
