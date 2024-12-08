# coding: utf-8

from typing import List

from fastapi import Depends, Security  # noqa: F401
from fastapi.openapi.models import OAuthFlowImplicit, OAuthFlows  # noqa: F401
from fastapi.security import (  # noqa: F401
    HTTPAuthorizationCredentials,
    HTTPBasic,
    HTTPBasicCredentials,
    HTTPBearer,
    OAuth2,
    OAuth2AuthorizationCodeBearer,
    OAuth2PasswordBearer,
    SecurityScopes,
)
from fastapi.security.api_key import APIKeyCookie, APIKeyHeader, APIKeyQuery  # noqa: F401

from openapi_server.models.extra_models import TokenModel
import json
from fastapi import HTTPException, status

bearer_auth = HTTPBearer()
USER_DB_FILE = "data/users.json"

def load_user_db(path=USER_DB_FILE):
    """
    load user database from file
    """
    try:
        with open(path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User database file not found",
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error decoding user database JSON",
        )


def get_token_BearerAuth(credentials: HTTPAuthorizationCredentials = Depends(bearer_auth)) -> TokenModel:
    """
    Check and retrieve authentication information from custom bearer token.

    :param credentials Credentials provided by Authorization header
    :type credentials: HTTPAuthorizationCredentials
    :return: Decoded token information or None if token is invalid
    :rtype: TokenModel | None
    """
    token = credentials.credentials
    # user_db = load_user_db()
    # for username, user in user_db.items():
    #     if user.token == token:
    #         return TokenModel(sub=username)
    
    # raise HTTPException(
    #     status_code=status.HTTP_401_UNAUTHORIZED,
    #     detail="Invalid token",
    # )


