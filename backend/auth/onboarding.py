from database import db
from fastapi import HTTPException, FastAPI, Depends
from pydantic import BaseModel, Field
from sqlalchemy import text
import os
from dotenv import load_dotenv
import bcrypt
import uvicorn
import jwt
import json
from middleware import create_token, verify_token

app = FastAPI()
token_time = int(os.getenv("token_time"))

class OnboardingData(BaseModel):
    age_range: str = Field(..., example="6-10")
    is_guardian: bool = Field(..., example=False)
    gender: str = Field(..., example="Female")
    target_language: str = Field(..., example="Yoruba")
    motivations: list[str] = Field(..., example=["Travel", "Culture"])
    learning_path: str = Field(..., example="Beginner")
    profeciency_level: str = Field(..., example="Intermediate")

@app.post("/api/user/onboarding")
def onboarding(data: OnboardingData, user: dict = Depends(verify_token)):
    user_id = user.get("id")

    # check the DB to ensure user account is real
    check_user_query = text("SELECT id FROM users WHERE id = :user_id")
    user_exists = db.execute(check_user_query, {"user_id": user_id}).fetchone()

    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Prevent duplicate onboarding entries
    check_onboarding_query = text("SELECT id FROM onboarding WHERE user_id = :user_id")
    onboarding_exists = db.execute(check_onboarding_query, {"user_id": user_id}).fetchone()

    if onboarding_exists:
        raise HTTPException(status_code=400, detail="Onboarding data already exists for this user.")
    
    insert_query = """
        INSERT INTO onboarding (user_id, age_range, is_guardian, gender, target_language, motivations, learning_path, proficiency_level)
        VALUES (:user_id, :age_range, :is_guardian, :gender, :target_language, :motivations, :learning_path, :proficiency_level)
    """
    motivations_json = json.dumps(data.motivations)

    db.execute(insert_query, {
        "user_id": user_id,
        "age_range": data.age_range,
        "is_guardian": data.is_guardian,
        "gender": data.gender,
        "target_language": data.target_language,
        "motivations": motivations_json,
        "learning_path": data.learning_path,
        "proficiency_level": data.profeciency_level
    })

    db.commit()
    return {"message": "Onboarding data saved successfully."}