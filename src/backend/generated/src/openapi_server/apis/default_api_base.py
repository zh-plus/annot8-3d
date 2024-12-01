# coding: utf-8

from typing import ClassVar, Dict, List, Tuple  # noqa: F401

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

class BaseDefaultApi:
    subclasses: ClassVar[Tuple] = ()

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BaseDefaultApi.subclasses = BaseDefaultApi.subclasses + (cls,)
    async def create_annotation(
        self,
        project_id: StrictInt,
        episode_id: StrictInt,
        annotation_request: AnnotationRequest,
    ) -> Annotation:
        ...


    async def create_episode(
        self,
        project_id: StrictInt,
        episode_request: EpisodeRequest,
    ) -> Episode:
        ...


    async def create_project(
        self,
        project_request: ProjectRequest,
    ) -> Project:
        ...


    async def delete_annotation(
        self,
        project_id: Annotated[StrictInt, Field(description="The ID of the project")],
        episode_id: Annotated[StrictInt, Field(description="The ID of the episode")],
        annotation_id: Annotated[StrictInt, Field(description="The ID of the annotation to delete")],
    ) -> None:
        ...


    async def get_annotations(
        self,
        project_id: StrictInt,
        episode_id: StrictInt,
    ) -> Dict[str, Any]:
        raise NotImplementedError("get_annotations() is not implemented")


    async def get_episode(
        self,
        project_id: StrictInt,
        episode_id: StrictInt,
    ) -> Episode:
        ...


    async def get_projects(
        self,
    ) -> List[Project]:
        ...


    async def list_episodes(
        self,
        project_id: StrictInt,
    ) -> List[Episode]:
        ...


    async def list_pcd_files(
        self,
        list_pcd_files_request: ListPcdFilesRequest,
    ) -> List[PCDFile]:
        ...


    async def login_post(
        self,
        login_request: LoginRequest,
    ) -> LoginResponse:
        ...


    async def register_post(
        self,
        register_request: RegisterRequest,
    ) -> None:
        ...


    async def update_annotation(
        self,
        project_id: StrictInt,
        episode_id: StrictInt,
        annotation_id: StrictInt,
        annotation_update_request: AnnotationUpdateRequest,
    ) -> Annotation:
        ...


    async def upload_pcd(
        self,
        project_id: Annotated[Optional[StrictInt], Field(description="The ID of the project")],
        pcd_file: Annotated[Optional[Union[StrictBytes, StrictStr, Tuple[StrictStr, StrictBytes]]], Field(description="The .pcd file to be uploaded")],
    ) -> None:
        ...
