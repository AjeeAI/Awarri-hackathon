from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from pymysql.constants import CLIENT

load_dotenv()

db_url = f"mysql+pymysql://{os.getenv('dbuser')}:{os.getenv('dbpassword')}@{os.getenv('dbhost')}:{os.getenv('dbport')}/{os.getenv('dbname')}"

engine = create_engine(
    db_url,
    connect_args={
        "client_flag": CLIENT.MULTI_STATEMENTS
    }
)

session = sessionmaker(bind=engine)
db = session()

create_tables_query = """
CREATE TABLE IF NOT EXISTS onboarding (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    age_range  VARCHAR(50),
    is_guardian BOOLEAN,
    gender VARCHAR(50),
    target_language VARCHAR(50),
    motivations JSON,
    learning_path VARCHAR(50),
    proficiency_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

db.execute(text(create_tables_query))
print("Onboarding table created successfully.")