# coding: utf-8
from fastapi import APIRouter, HTTPException, Body
from openapi_server.models.login_request import LoginRequest
from openapi_server.models.login_response import LoginResponse
from openapi_server.models.register_request import RegisterRequest
from openapi_server.apis.default_api_base import BaseDefaultApi

router = APIRouter()

@router.post(
    "/login",
    responses={
        200: {"model": LoginResponse, "description": "Successfully authenticated"},
        401: {"description": "Unauthorized"},
        404: {"description": "Unauthorized"},
    },
    tags=["user"],
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
    tags=["user"],
    summary="Register a new user",
    response_model_by_alias=True,
)
async def register_post(
    register_request: RegisterRequest = Body(None, description=""),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().register_post(register_request)