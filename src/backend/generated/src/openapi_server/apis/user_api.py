from typing import Dict, List  # noqa: F401
import importlib
import pkgutil

from openapi_server.apis.default_api_base import BaseDefaultApi
import openapi_server.impl

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    Query,
    Response,
    Security,
    status,
)

from openapi_server.models.extra_models import TokenModel  # noqa: F401
from pydantic import Field, StrictBytes, StrictInt, StrictStr
from typing import Any, List, Optional, Tuple, Union
from openapi_server.models.login_request import LoginRequest
from openapi_server.models.login_response import LoginResponse
from openapi_server.models.register_request import RegisterRequest
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)

@router.post(
    "/login",
    responses={
        200: {"model": LoginResponse, "description": "Successfully authenticated"},
        401: {"description": "Unauthorized"},
        404: {"description": "Unauthorized"},
    },
    tags=["default"],
    summary="Authenticate and get a JWT token",
    response_model_by_alias=True,
)
async def login_post(
    login_request: LoginRequest = Body(None, description=""),
) -> LoginResponse:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().login_post(login_request)


@router.post(
    "/register",
    responses={
        201: {"description": "User registered successfully"},
        400: {"description": "Registration failed"},
    },
    tags=["default"],
    summary="Register a new user",
    response_model_by_alias=True,
)
async def register_post(
    register_request: RegisterRequest = Body(None, description=""),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().register_post(register_request)

