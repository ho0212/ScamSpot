import tempfile, pandas as pd, zipfile
from kaggle.api.kaggle_api_extended import KaggleApi
from pathlib import Path
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# --- Database connection details ---
load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

engine = create_engine(f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# --- Extract ---

# Dataset details from Kaggle
owner = "llabhishekll"
dataset = "fraud-email-dataset"

api = KaggleApi()
api.authenticate()

# Create a temporary directory to load the dataset
with tempfile.TemporaryDirectory() as tmpdir:
    tmpdir = Path(tmpdir)

    # Download zip
    api.dataset_download_files(f"{owner}/{dataset}", path=tmpdir, unzip=False)

    zip_path = tmpdir / f"{dataset}.zip"

    # Read CSV directly from the zip
    with zipfile.ZipFile(zip_path) as z:
        print(z.namelist())
        with z.open("fraud_email_.csv") as f:
            fraud_email_df = pd.read_csv(f)

    print(fraud_email_df.head())


# --- Transform ---
fraud_email_df.rename(columns={"Text": "content", "Class": "class"}, inplace=True)
fraud_email_df.dropna(inplace=True)
print(fraud_email_df.head())

# --- Load ---
fraud_email_df.to_sql("email_detection_dataset", engine, if_exists="append", index=False)
print("Data inserted into email_detection_dataset table")
