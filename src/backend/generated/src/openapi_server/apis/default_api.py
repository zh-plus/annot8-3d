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
from openapi_server.models.episode import Episode
from openapi_server.models.episode_request import EpisodeRequest
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
