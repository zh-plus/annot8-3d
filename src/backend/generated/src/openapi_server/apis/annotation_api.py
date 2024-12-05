from pathlib import Path as FilePath
from typing import Dict, List  # noqa: F401
import importlib
import json
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
from openapi_server.security_api import get_token_BearerAuth

router = APIRouter()

ns_pkg = openapi_server.impl
for _, name, _ in pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + "."):
    if "annotation_api_impl" in name:
        importlib.import_module(name)

PROJECT_ROOT = FilePath(__file__).parent.parent.parent.parent   

@router.post(
    "/projects/{project_id}/episodes/{episode_id}/annotations/create",
    responses={
        201: {"model": Annotation, "description": "Annotation created successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Create a new annotation for a specific episode",
    response_model_by_alias=True,
)
async def create_annotation(
    project_id: StrictInt = Path(..., description=""),
    episode_id: StrictInt = Path(..., description=""),
    annotation_request: AnnotationRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Annotation:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().create_annotation(project_id, episode_id, annotation_request)



@router.delete(
    "/projects/{project_id}/episodes/{episode_id}/annotations/{annotation_id}",
    responses={
        200: {"description": "Annotation deleted successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project, Episode, or Annotation not found"},
    },
    tags=["default"],
    summary="Delete a specific annotation within an episode",
    response_model_by_alias=True,
)
async def delete_annotation(
    project_id: Annotated[StrictInt, Field(description="The ID of the project")] = Path(..., description="The ID of the project"),
    episode_id: Annotated[StrictInt, Field(description="The ID of the episode")] = Path(..., description="The ID of the episode"),
    annotation_id: Annotated[StrictInt, Field(description="The ID of the annotation to delete")] = Path(..., description="The ID of the annotation to delete"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> None:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().delete_annotation(project_id, episode_id, annotation_id)


@router.get(
    "/projects/{project_id}/episodes/{episode_id}/annotations/{file_name}",
    responses={
        200: {"model": List[Annotation], "description": "List of annotations for the specified episode in a project"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
        404: {"description": "Project or Episode not found"},
    },
    tags=["default"],
    summary="Get annotations for a specific episode within a project",
    response_model_by_alias=True,
)
async def get_annotations(
    project_id: StrictInt = Path(..., description=""),
    episode_id: StrictInt = Path(..., description=""),
    file_name: StrictStr =  Path(..., description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Dict[str, Any]:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    
    return await BaseDefaultApi.subclasses[0]().get_annotations(project_id, episode_id,file_name)


@router.put(
    "/projects/{project_id}/episodes/{episode_id}/annotations/{annotation_id}",
    responses={
        200: {"model": Annotation, "description": "Annotation updated successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Update a specific annotation within an episode",
    response_model_by_alias=True,
)
async def update_annotation(
    project_id: StrictInt = Path(..., description=""),
    episode_id: StrictInt = Path(..., description=""),
    annotation_id: StrictInt = Path(..., description=""),
    annotation_update_request: AnnotationUpdateRequest = Body(None, description=""),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> Annotation:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().update_annotation(project_id, episode_id, annotation_id, annotation_update_request)

@router.put(
    "/projects/{project_id}/episodes/{episode_id}/save_annotations",
    responses={
        200: {"model": Annotation, "description": "Annotation updated successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["default"],
    summary="Update a specific annotation within an episode",
    response_model_by_alias=True,
)
async def save_annotations(
    project_id: StrictInt = Path(..., description=""),
    episode_id: StrictInt = Path(..., description=""),
    annotations: Annotation= Body(None, description="List of annotation updates"),
    token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    ),
) -> bool:
    if not BaseDefaultApi.subclasses:
        raise HTTPException(status_code=500, detail="Not implemented")
    return await BaseDefaultApi.subclasses[0]().save_annotations(project_id, episode_id,annotations)