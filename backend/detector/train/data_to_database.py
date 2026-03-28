import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

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
engine = create_engine(
    f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
)

def load_files_from_folder(folder_path):
    """
    Load all CSV and Excel files from a folder into PostgreSQL.
    Each file becomes a separate table (table name = file name without extension).
    """
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return

    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.csv', '.xls', '.xlsx'))]

    if not files:
        print("No CSV or Excel files found in the folder.")
        return

    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        file_ext = os.path.splitext(file_name)[-1].lower()
        table_name = os.path.splitext(file_name)[0].lower().replace(' ', '_')  # Clean table name

        try:
            # Handle CSV encoding issues
            if file_ext == '.csv':
                try:
                    df = pd.read_csv(file_path, encoding='utf-8')
                except UnicodeDecodeError:
                    df = pd.read_csv(file_path, encoding='latin1')
            elif file_ext in ['.xls', '.xlsx']:
                try:
                    import openpyxl  # Ensure dependency
                except ImportError:
                    print("Missing dependency 'openpyxl'. Install via 'pip install openpyxl'")
                    continue
                df = pd.read_excel(file_path)
            else:
                print(f"Skipping unsupported file format: {file_ext}")
                continue

            print(f"Loaded {len(df)} rows from '{file_name}'")

            # Load into PostgreSQL (replace table if exists)
            df.to_sql(table_name, engine, if_exists='replace', index=False, schema='public')
            print(f"Data successfully loaded into table '{table_name}'.\n")

        except Exception as e:
            print(f"Error loading file '{file_name}': {e}")

# Execute
load_files_from_folder(DATASET_PATH)
