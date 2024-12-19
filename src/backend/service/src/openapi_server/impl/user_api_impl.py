import json
import uuid
import logging
from openapi_server.apis.default_api_base import BaseDefaultApi
from openapi_server.models import login_request, login_response, register_request
from pathlib import Path as FilePath
from fastapi import HTTPException
from openapi_server.security_api import load_user_db
from openapi_server.impl.database import JsonDatabase

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
db = JsonDatabase()

class UserApiImpl(BaseDefaultApi):
    async def login_post(self, login_request: login_request.LoginRequest) -> login_response.LoginResponse:
        logger.info(f"login_post: {login_request}")
        users = load_user_db(db)

        if login_request.username not in users:
            raise HTTPException(status_code=401, detail="User not found")

        # check password
        user = users[login_request.username]
        if user["password"] != login_request.password:
            raise HTTPException(status_code=401, detail="Invalid password")

        # generate a temperary token
        token = str(uuid.uuid4())
        user["token"] = token
        db.save_user_db(users)
        return login_response.LoginResponse(token=token)
        
    async def register_post(self, register_request: register_request.RegisterRequest) -> None:
        logger.info(f"register_post: {register_request}")
        
        users = load_user_db(db)
        if register_request.username in users:
            raise HTTPException(status_code=400, detail="User already exists")
        
        users[register_request.username] = {
            "username": register_request.username,
            "password": register_request.password,
            "token": None,
            "projects": []
        }
        db.save_user_db(users)
        logger.info(f"User {register_request.username} registered successfully")
        return None

