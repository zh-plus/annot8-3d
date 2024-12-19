# coding: utf-8
from typing import List
from fastapi import APIRouter, HTTPException, Path, Body, Security
from openapi_server.models.project import Project
from openapi_server.models.pcd_file import PCDFile
from openapi_server.models.project_request import ProjectRequest
from openapi_server.models.list_pcd_files_request import ListPcdFilesRequest
from openapi_server.security_api import get_token_BearerAuth
from openapi_server.models.extra_models import TokenModel
from openapi_server.apis.default_api_base import BaseDefaultApi

router = APIRouter()

@router.post(
    "/projects",
    responses={
        201: {"model": Project, "description": "Project created successfully"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["project"],
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


@router.get(
    "/projects/{project_id}/annotations",
    responses={
        200: {"model": List[Project], "description": "List of annotations for the specified project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project not found"},
    },
    tags=["project"],
    summary="Get annotations for a project",
    response_model_by_alias=True,
)
async def get_annotations(
    project_id: int = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Project]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().get_annotations(project_id)


@router.get(
    "/projects",
    responses={
        200: {"model": List[Project], "description": "List of user projects"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["project"],
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
    "/projects/pcd_files",
    responses={
        200: {"model": List[PCDFile], "description": "List of .pcd files for the project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["project"],
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
    "/projects/upload_pcd",
    responses={
        200: {"description": "File uploaded successfully"},
        400: {"description": "Bad request - invalid file format or missing project ID"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["project"],
    summary="Upload a .pcd file for a specific project",
    response_model_by_alias=True,
)
async def upload_pcd(
    project_id: int = Body(..., description=""),
    pcd_file: bytes = Body(..., description="The .pcd file to be uploaded"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().upload_pcd(project_id, pcd_file)
