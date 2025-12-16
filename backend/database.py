from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from sqlalchemy import text
import pymysql
import os
load_dotenv()


db_url = f"mysql+pymysql://{os.getenv('dbuser')}:{os.getenv('dbpassword')}@{os.getenv('dbhost')}:{os.getenv('dbport')}/{os.getenv('dbname')}"

engine = create_engine(
    db_url
)

session = sessionmaker(bind=engine)
db = session()
create_users_table = text("""
CREATE TABLE IF NOT EXISTS users(
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);                       
                          """)

db.execute(create_users_table)
print("User table created successfully")

create_tables_query = text("""
CREATE TABLE IF NOT EXISTS onboarding (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age_range  VARCHAR(50),
    is_guardian BOOLEAN,
    gender VARCHAR(50),
    target_language VARCHAR(50),
    motivations TEXT,               
    learning_path VARCHAR(50),
    proficiency_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
""")




db.execute(text(create_tables_query))
db.commit()
print("Onboarding table created successfully.")