import json
import logging
from pathlib import Path as FilePath
from typing import Dict
from fastapi import HTTPException

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = FilePath(__file__).parent.parent.parent.parent.parent
USER_DB_JSON_FILE = PROJECT_ROOT / "data" / "user_db.json"

class Database:
    """Abstract class for user database operations"""
    def load_user_db(self) -> Dict:
        pass

    def save_user_db(self, users: Dict) -> None:
        pass

    def add_user(self, username: str, password: str, token: str) -> None:
        pass

    def get_user(self, username: str) -> Dict:
        pass

class JsonDatabase(Database):
    """Json file based user database"""
    def load_user_db(self) -> Dict:
        try:
            with open(USER_DB_JSON_FILE, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}  

    def save_user_db(self, users: Dict) -> None:
        try:
            with open(USER_DB_JSON_FILE, 'w') as f:
                json.dump(users, f, indent=4)
        except Exception as e:
            logger.error(f"Error saving user database: {str(e)}")

    def add_user(self, username: str, password: str, token: str) -> None:
        users = self.load_user_db()
        users[username] = {"username": username, "password": password, "token": token, "projects":[]}
        self.save_user_db(users)

    def get_user(self, username: str) -> Dict:
        users = self.load_user_db()
        return users.get(username, None)
