# coding: utf-8

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
from typing_extensions import Annotated
from openapi_server.models.annotation import Annotation
from openapi_server.models.annotation_request import AnnotationRequest
from openapi_server.models.annotation_update_request import AnnotationUpdateRequest
from openapi_server.models.delete_annotation_request import DeleteAnnotationRequest
from openapi_server.models.list_annotations_request import ListAnnotationsRequest
from openapi_server.models.list_pcd_files_request import ListPcdFilesRequest
from openapi_server.models.login_request import LoginRequest
from openapi_server.models.login_response import LoginResponse
from openapi_server.models.pcd_file import PCDFile
from openapi_server.models.project import Project
from openapi_server.models.project_request import ProjectRequest
from openapi_server.models.register_request import RegisterRequest
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/annotations/create",
    responses={
        201: {"model": Annotation, "description": "Annotation created successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Create a new annotation for a specific .pcd file in a project",
    response_model_by_alias=True,
)
async def create_annotation(
    annotation_request: AnnotationRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Annotation:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().create_annotation(annotation_request)


@router.post(
    "/projects",
    responses={
        201: {"model": Project, "description": "Project created successfully"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Create a new project",
    response_model_by_alias=True,
)
async def create_project(
    project_request: ProjectRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Project:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().create_project(project_request)


@router.post(
    "/annotations/delete",
    responses={
        200: {"description": "Annotation deleted successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Delete a specific annotation",
    response_model_by_alias=True,
)
async def delete_annotation(
    delete_annotation_request: DeleteAnnotationRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().delete_annotation(delete_annotation_request)


@router.get(
    "/projects/{project_id}/annotations",
    responses={
        200: {"model": List[Annotation], "description": "List of annotations for the specified project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project not found"},
    },
    tags=["default"],
    summary="Get annotations for a project",
    response_model_by_alias=True,
)
async def get_annotations(
    project_id: StrictInt = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Annotation]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().get_annotations(project_id)


@router.get(
    "/projects",
    responses={
        200: {"model": List[Project], "description": "List of user projects"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Get a list of user projects",
    response_model_by_alias=True,
)
async def get_projects(
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Project]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().get_projects()


@router.post(
    "/annotations",
    responses={
        200: {"model": List[Annotation], "description": "List of annotations for the .pcd file"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="List all annotations for a specific .pcd file",
    response_model_by_alias=True,
)
async def list_annotations(
    list_annotations_request: ListAnnotationsRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Annotation]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().list_annotations(list_annotations_request)


@router.post(
    "/projects/pcd_files",
    responses={
        200: {"model": List[PCDFile], "description": "List of .pcd files for the project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="List all .pcd files for a specific project",
    response_model_by_alias=True,
)
async def list_pcd_files(
    list_pcd_files_request: ListPcdFilesRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[PCDFile]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().list_pcd_files(list_pcd_files_request)


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


@router.post(
    "/annotations/update",
    responses={
        200: {"model": Annotation, "description": "Annotation updated successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Update a specific annotation",
    response_model_by_alias=True,
)
async def update_annotation(
    annotation_update_request: AnnotationUpdateRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Annotation:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().update_annotation(annotation_update_request)


@router.post(
    "/projects/upload_pcd",
    responses={
        200: {"description": "File uploaded successfully"},
        400: {"description": "Bad request - invalid file format or missing project ID"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Upload a .pcd file for a specific project",
    response_model_by_alias=True,
)
async def upload_pcd(
    project_id: Annotated[Optional[StrictInt], Field(description="The ID of the project")] = Form(None, description="The ID of the project"),
    pcd_file: Annotated[Optional[Union[StrictBytes, StrictStr, Tuple[StrictStr, StrictBytes]]], Field(description="The .pcd file to be uploaded")] = Form(None, description="The .pcd file to be uploaded"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().upload_pcd(project_id, pcd_file)
