# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictBytes, StrictInt, StrictStr  # noqa: F401
from typing import Any, List, Optional, Tuple, Union  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from ..src.openapi_server.models.annotation import Annotation  # noqa: F401
from ..src.openapi_server.models.annotation_request import AnnotationRequest  # noqa: F401
from ..src.openapi_server.models.annotation_update_request import AnnotationUpdateRequest  # noqa: F401
from ..src.openapi_server.models.episode import Episode  # noqa: F401
from ..src.openapi_server.models.episode_request import EpisodeRequest  # noqa: F401
from ..src.openapi_server.models.list_pcd_files_request import ListPcdFilesRequest  # noqa: F401
from ..src.openapi_server.models.login_request import LoginRequest  # noqa: F401
from ..src.openapi_server.models.login_response import LoginResponse  # noqa: F401
from ..src.openapi_server.models.pcd_file import PCDFile  # noqa: F401
from ..src.openapi_server.models.project import Project  # noqa: F401
from ..src.openapi_server.models.project_request import ProjectRequest  # noqa: F401
from ..src.openapi_server.models.register_request import RegisterRequest  # noqa: F401


def test_create_annotation(client: TestClient):
    """Test case for create_annotation

    Create a new annotation for a specific episode
    """
    annotation_request = {"episode_id":1,"pcd_file_id":1,"label":"Car","geometry":"cube","size":{"width":2.5,"height":1.5},"position":{"x":10.0,"y":5.0,"z":2.0},"rotation":{"x":0.0,"y":45.0,"z":0.0}}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/projects/{project_id}/episodes/{episode_id}/annotations/create".format(project_id=56, episode_id=56),
    #    headers=headers,
    #    json=annotation_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_create_episode(client: TestClient):
    """Test case for create_episode

    Create a new episode for a specific project
    """
    episode_request = {"name":"Episode 1","description":"Sequence of frames for building facade"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/projects/{project_id}/episodes".format(project_id=56),
    #    headers=headers,
    #    json=episode_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_create_project(client: TestClient):
    """Test case for create_project

    Create a new project
    """
    project_request = {"name":"Building Facade","description":"Annotations for building facade images"}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/projects",
    #    headers=headers,
    #    json=project_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_delete_annotation(client: TestClient):
    """Test case for delete_annotation

    Delete a specific annotation within an episode
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "DELETE",
    #    "/projects/{project_id}/episodes/{episode_id}/annotations/{annotation_id}".format(project_id=56, episode_id=56, annotation_id=56),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_annotations(client: TestClient):
    """Test case for get_annotations

    Get annotations for a specific episode within a project
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/projects/{project_id}/episodes/{episode_id}/annotations".format(project_id=56, episode_id=56),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_episode(client: TestClient):
    """Test case for get_episode

    Get details of a specific episode within a project
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/projects/{project_id}/episodes/{episode_id}".format(project_id=56, episode_id=56),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_projects(client: TestClient):
    """Test case for get_projects

    Get a list of user projects
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/projects",
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_list_episodes(client: TestClient):
    """Test case for list_episodes

    Get a list of episodes for a project
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/projects/{project_id}/episodes".format(project_id=56),
    #    headers=headers,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_list_pcd_files(client: TestClient):
    """Test case for list_pcd_files

    List all .pcd files for a specific project
    """
    list_pcd_files_request = openapi_server.ListPcdFilesRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/projects/pcd_files",
    #    headers=headers,
    #    json=list_pcd_files_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_login_post(client: TestClient):
    """Test case for login_post

    Authenticate and get a JWT token
    """
    login_request = {"password":"password","username":"username"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/login",
    #    headers=headers,
    #    json=login_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_register_post(client: TestClient):
    """Test case for register_post

    Register a new user
    """
    register_request = {"password":"password","username":"username"}

    headers = {
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/register",
    #    headers=headers,
    #    json=register_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_update_annotation(client: TestClient):
    """Test case for update_annotation

    Update a specific annotation within an episode
    """
    annotation_update_request = {"annotation_id":0}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "PUT",
    #    "/projects/{project_id}/episodes/{episode_id}/annotations/{annotation_id}".format(project_id=56, episode_id=56, annotation_id=56),
    #    headers=headers,
    #    json=annotation_update_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_upload_pcd(client: TestClient):
    """Test case for upload_pcd

    Upload a .pcd file for a specific project
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    data = {
        "project_id": 56,
        "pcd_file": '/path/to/file'
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/projects/upload_pcd",
    #    headers=headers,
    #    data=data,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

