# coding: utf-8
from typing import List
from fastapi import APIRouter, HTTPException, Body, Security
from openapi_server.models.annotation import Annotation
from openapi_server.models.annotation_request import AnnotationRequest
from openapi_server.models.delete_annotation_request import DeleteAnnotationRequest
from openapi_server.models.annotation_update_request import AnnotationUpdateRequest
from openapi_server.models.list_annotations_request import ListAnnotationsRequest
from openapi_server.security_api import get_token_BearerAuth
from openapi_server.models.extra_models import TokenModel
from openapi_server.apis.default_api_base import BaseDefaultApi

router = APIRouter()

@router.post(
    "/annotations/create",
    responses={
        201: {"model": Annotation, "description": "Annotation created successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["annotation"],
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
    "/annotations/delete",
    responses={
        200: {"description": "Annotation deleted successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["annotation"],
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


@router.post(
    "/annotations",
    responses={
        200: {"model": List[Annotation], "description": "List of annotations for the .pcd file"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["annotation"],
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
    "/annotations/update",
    responses={
        200: {"model": Annotation, "description": "Annotation updated successfully"},
        400: {"description": "Bad request - missing or invalid data"},
        401: {"description": "Unauthorized - missing or invalid JWT"},
    },
    tags=["annotation"],
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
