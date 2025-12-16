from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from sqlalchemy import text
import bcrypt
from middleware import create_token, verify_token
from database import db
import os
from onboarding import router as onboarding_router
from data import router as data_router

from ai_app import router as english_translator_router
from ai_app import router as english_translator_voice_router

from ai_api import router as curriculum_router
from ai_api import router as lesson_router
from ai_api import router as practice_router
from ai_api import router as evaluate_router
from ai_api import router as progress_router



load_dotenv()

app = FastAPI(title="Awarri hackathon", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*",
                   "https://langteach-awarri.web.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
token_time = int(os.getenv("token_time", 30)) 

@app.get("/")
def home():
    return "This is the landing route for the API"

class User(BaseModel):
    email: str = Field(..., example="adesanya@gmail.com")
    name: str = Field(..., example="Inioluwa Adesanya")
    password: str = Field(..., example="Hediot01")

@app.post("/signup")
def signup(user: User):
    try:
        # 1. Hash the password
        salt = bcrypt.gensalt()
        hashed_bytes = bcrypt.hashpw(user.password.encode("utf-8"), salt)
        hashed_password = hashed_bytes.decode('utf-8') 

        # 2. Insert into DB
        insert_query = text("""
            INSERT INTO users (name, email, password)
            VALUES (:name, :email, :password)
        """)
        
        db.execute(insert_query, {"name": user.name, "email": user.email, "password": hashed_password})
        db.commit()
        
        # 3. Fetch the new user immediately to get the ID
        # (We need the ID to generate the token, just like in login)
        fetch_query = text("SELECT id, name, email FROM users WHERE email = :email")
        new_user = db.execute(fetch_query, {"email": user.email}).mappings().fetchone()
        
        # 4. Create the Token
        encoded_token = create_token(details={
            "id": new_user["id"],
            "email": new_user["email"],
            "name": new_user["name"]
        }, expiry=token_time)
        
        # 5. Return Token + User Data
        return {
            "message": "User created", 
            "token": encoded_token,
            "user": {"name": new_user["name"], "email": new_user["email"]}
        }
    
    except Exception as e:
        db.rollback()
        
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")
    
class Login(BaseModel):
    email: str = Field(..., example="adesanya@gmail.com")
    password: str = Field(..., example="Ini123")

@app.post("/login")
def login(user: Login):
    try:
        query = text("SELECT * FROM users WHERE email = :email")
        
        # FIX 2: Check if user exists BEFORE accessing data
        result = db.execute(query, {"email": user.email}).mappings().fetchone()
        
        if not result:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        stored_password_hash = result["password"]

        # FIX 3: Actually verify the password!
        # Convert user input to bytes, and stored hash to bytes
        is_match = bcrypt.checkpw(
            user.password.encode('utf-8'), 
            stored_password_hash.encode('utf-8')
        )

        if not is_match:
             raise HTTPException(status_code=401, detail="Invalid email or password")
        
        encoded_token = create_token(details={
            "id": result.id,
            "email": result.email,
            "name": result.name
        }, expiry=token_time)
        
        return {
            "message": "Login successful",
            "token": encoded_token,
            "user": {"name": result.name, "email": result.email}
        }
        
    except HTTPException as e:
        raise e 
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(onboarding_router, prefix="/api")
app.include_router(data_router, prefix="/api")



"""
Endpoint for AI specific tasks
""" 

app.include_router(english_translator_router, prefix="/api")
app.include_router(english_translator_voice_router, prefix="/api")


app.include_router(curriculum_router, prefix="/api")
app.include_router(lesson_router, prefix="/api")
app.include_router(practice_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(evaluate_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)