from database import db
from fastapi import APIRouter, HTTPException, FastAPI, Depends
from pydantic import BaseModel, Field
from sqlalchemy import text
import os
from dotenv import load_dotenv
import bcrypt
import uvicorn
import jwt
import json
from middleware import create_token, verify_token

router = APIRouter()

@router.get("/user/data")
def get_user_data(user: dict = Depends(verify_token)):
    try:
        user_id = user.get("id")
        query = text("""
                 SELECT target_language, age_range, proficiency_level, created_at FROM onboarding WHERE user_id = :user_id    
                     """)
        db_result = db.execute(query, {"user_id": user_id}).fetchone()
        if not db_result:
            raise HTTPException(status_code=404, detail="Onboarding data not found for this user.")
        result = {
            "target_language": db_result.target_language,
            "age_range": db_result.age_range,
            "proficiency_level": db_result.proficiency_level,
            "created_at": db_result.created_at
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail= "An error occurred while retrieving user data.")