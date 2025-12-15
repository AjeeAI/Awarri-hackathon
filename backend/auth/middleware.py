import jwt
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from fastapi import Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security

bearer = HTTPBearer()
load_dotenv()
SECRET_KEY = os.getenv("secret_key")

def create_token(data: dict, expiry: int):
    expire = datetime.now() + timedelta(minutes=expiry)

    data.update({"exp": expire})

    encoded_jwt = jwt.encode(data, SECRET_KEY)

    return encoded_jwt

def verify_token(request: HTTPAuthorizationCredentials = Security(bearer)):
    token = request.credentials

    verified_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

    return {
        "email": verified_token["email"],
        "id": verified_token["id"]
    }