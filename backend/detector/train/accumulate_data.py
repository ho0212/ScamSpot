# Accumulate training dataset

import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import re
import os

# Database connection details
load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

engine = create_engine(f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# Retrieve data safely using double quotes for case-sensitive columns
table1 = pd.read_sql('SELECT "Type", "Text" FROM adversarial_scam_dataset', engine)
table2 = pd.read_sql('SELECT "v1", "v2" FROM sms_spam_ham', engine)
table3 = pd.read_sql('SELECT "LABEL", "TEXT" FROM sms_phishing_dataset', engine)

# Standardize column names
table1.rename(columns={'Type': 'label', 'Text': 'text'}, inplace=True)
table2.rename(columns={'v1': 'label', 'v2': 'text'}, inplace=True)
table3.rename(columns={'LABEL': 'label', 'TEXT': 'text'}, inplace=True)

# Map labels to unified categories
label_mapping = {
    'ham': 0,
    -1: 0,
    'Non-scam': 0,
    'spam': 1,
    'Spam': 1,
    1: 2,   # Adversarial scam
    0: 2,   # Regular scam
    'Smishing': 2,
    'smishing': 2
}

def map_label(x):
    return label_mapping.get(x, None)

table1['label'] = table1['label'].map(map_label)
table2['label'] = table2['label'].map(map_label)
table3['label'] = table3['label'].map(map_label)

# Concatenate all tables
accumulated_df = pd.concat([table1, table2, table3], ignore_index=True)

# Remove rows with unmapped labels
accumulated_df = accumulated_df.dropna(subset=['label'])

# Flag hyperlinks in text ---
url_pattern = r'https?://\S+|www\.\S+'
accumulated_df['has_hyperlink'] = accumulated_df['text'].apply(lambda x: 1 if re.search(url_pattern, str(x)) else 0)


# Save accumulated data back to database
accumulated_df.to_sql('accumulated_training_data', engine, if_exists='replace', index=False, schema='public')

print("Accumulated data table created successfully!")
print(accumulated_df.head())
