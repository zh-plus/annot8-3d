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
from openapi_server.models.episode import Episode
from openapi_server.models.episode_request import EpisodeRequest
from openapi_server.models.list_pcd_files_request import ListPcdFilesRequest
from openapi_server.models.pcd_file import PCDFile
from openapi_server.models.project import Project
from openapi_server.models.project_request import ProjectRequest
from openapi_server.models.label import Label
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    importlib.import_module(name)


@router.post(
    "/projects/{project_id}/episodes",
    responses={
        201: {"model": Episode, "description": "Episode created successfully"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project not found"},
    },
    tags=["default"],
    summary="Create a new episode for a specific project",
    response_model_by_alias=True,
)
async def create_episode(
    project_id: StrictInt = Path(..., description=""),
    episode_request: EpisodeRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Episode:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().create_episode(project_id, episode_request)


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
    
    username = token_BearerAuth.sub
    return await BaseDefaultApi.subclasses[0]().create_project(project_request, username)

@router.get(
    "/projects/{project_id}/episodes/{episode_id}",
    responses={
        200: {"model": Episode, "description": "Details of the specified episode"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project or Episode not found"},
    },
    tags=["default"],
    summary="Get details of a specific episode within a project",
    response_model_by_alias=True,
)
async def get_episode(
    project_id: StrictInt = Path(..., description=""),
    episode_id: StrictInt = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Episode:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().get_episode(project_id, episode_id)


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
    username = token_BearerAuth.sub
    return await BaseDefaultApi.subclasses[0]().get_projects(username)

@router.get(
    "/list",
    responses={
        200: {"description": "List of user projects"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Get a list of user projects",
    response_model_by_alias=True,
)
async def list_projects():
    return await BaseDefaultApi.subclasses[1]().list_projects()

@router.get(
    "/projects/{project_id}/episodes",
    responses={
        200: {"model": List[Episode], "description": "List of episodes for the specified project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project not found"},
    },
    tags=["default"],
    summary="Get a list of episodes for a project",
    response_model_by_alias=True,
)
async def list_episodes(
    project_id: StrictInt = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Episode]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    
    db = JSONDatabase()
    username = token_BearerAuth.sub
    user = db.get_user(username)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if project_id not in user['projects']:
        raise HTTPException(status_code=404, detail="You do not have access to this project")
    return await BaseDefaultApi.subclasses[0]().list_episodes(project_id)


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


@router.get(
    "/projects/{project_id}/get_all_PCDFiles",
    responses={
        200: {"description": "File uploaded successfully"},
        400: {"description": "Bad request - invalid file format or missing project ID"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Upload all .pcd file for a specific project",
    response_model_by_alias=True,
)
async def get_all_PCDFiles(
    project_id: StrictInt = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Dict[str, Any]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[1]().get_all_PCDFiles(project_id)



@router.get(
    "/projects/{project_id}/get_labels",
    responses={
        200: {"description": "Label uploaded successfully"},
        400: {"description": "Bad request - invalid file format or missing project ID"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Upload all labels for a specific project",
    response_model_by_alias=True,
)
async def get_labels(
    project_id: StrictInt = Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> List[Label]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[1]().get_labels(project_id)

