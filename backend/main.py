from fastapi import FastAPI
from fastapi import HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from sqlalchemy import text
import bcrypt
from middleware import create_token, verify_token
from database import db
import os
load_dotenv()

app = FastAPI(title = "Awarri hackathon", version = "1.0.0")

app.add_middleware(
    CORSMiddleware,
 allow_origins = ["*"],
 allow_headers = ["*"],
 allow_methods = ["*"],
 allow_credentials = True
)
token_time = int(os.getenv("token_time"))

@app.get("/")
def home():
    return "This is the landing route for the API"


class User(BaseModel):
    email: str = Field(..., example="adesanya@gmail.com")
    name: str = Field(..., example="Inioluwa Adesanya")
    password: str = Field(..., example = "Hediot01")
@app.post("/signup")
def signup(user: User):
    try:
        salt = bcrypt.gensalt()
        hashedPassword = bcrypt.hashpw(user.password.encode("utf-8"), salt)
        print(hashedPassword)
        query = text("""
                    INSERT INTO users (name, email, password)
                    VALUES (:name, :email, :password)
                    """)
        
        db.execute(query, {"name": user.name, "email": user.email, "password": hashedPassword})
        
        db.commit()
        
        return {"message": "User created",
                "data": {"name": user.name, "email": user.email}}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class Login(BaseModel):
    email: str = Field(..., example="adesanya@gmail.com")
    password: str = Field(..., example = "Ini123")
@app.post("/login")
def login(user: Login):
    try:
        query = text("""
     SELECT * FROM users WHERE email = :email                
                     """)
        
        result = db.execute(query, {"email": user.email}).mappings().fetchone()
        stored_password = result["password"]
        
        if not result:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        encoded_token = create_token(details = {
            "id": result.id,
            "email": result.email,
            "name": result.name
        }, expiry=token_time)
        
        print("User login successful")
        
        return {
            "message": f"Login successful",
            "token": encoded_token
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))