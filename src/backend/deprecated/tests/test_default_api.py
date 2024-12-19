# coding: utf-8

from fastapi.testclient import TestClient


from pydantic import Field, StrictBytes, StrictInt, StrictStr  # noqa: F401
from typing import Any, List, Optional, Tuple, Union  # noqa: F401
from typing_extensions import Annotated  # noqa: F401
from openapi_server.models.annotation import Annotation  # noqa: F401
from openapi_server.models.annotation_request import AnnotationRequest  # noqa: F401
from openapi_server.models.annotation_update_request import AnnotationUpdateRequest  # noqa: F401
from openapi_server.models.delete_annotation_request import DeleteAnnotationRequest  # noqa: F401
from openapi_server.models.list_annotations_request import ListAnnotationsRequest  # noqa: F401
from openapi_server.models.list_pcd_files_request import ListPcdFilesRequest  # noqa: F401
from openapi_server.models.login_request import LoginRequest  # noqa: F401
from openapi_server.models.login_response import LoginResponse  # noqa: F401
from openapi_server.models.pcd_file import PCDFile  # noqa: F401
from openapi_server.models.project import Project  # noqa: F401
from openapi_server.models.project_request import ProjectRequest  # noqa: F401
from openapi_server.models.register_request import RegisterRequest  # noqa: F401


def test_create_annotation(client: TestClient):
    """Test case for create_annotation

    Create a new annotation for a specific .pcd file in a project
    """
    annotation_request = {"pcd_file_id":1,"label":"Car","geometry":"cube","size":{"width":2.5,"height":1.5},"position":{"x":10.0,"y":5.0,"z":2.0},"rotation":{"x":0.0,"y":45.0,"z":0.0}}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/annotations/create",
    #    headers=headers,
    #    json=annotation_request,
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

    Delete a specific annotation
    """
    delete_annotation_request = openapi_server.DeleteAnnotationRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/annotations/delete",
    #    headers=headers,
    #    json=delete_annotation_request,
    #)

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_get_annotations(client: TestClient):
    """Test case for get_annotations

    Get annotations for a project
    """

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "GET",
    #    "/projects/{project_id}/annotations".format(project_id=56),
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


def test_list_annotations(client: TestClient):
    """Test case for list_annotations

    List all annotations for a specific .pcd file
    """
    list_annotations_request = openapi_server.ListAnnotationsRequest()

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/annotations",
    #    headers=headers,
    #    json=list_annotations_request,
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

    Update a specific annotation
    """
    annotation_update_request = {"annotation_id":0}

    headers = {
        "Authorization": "Bearer special-key",
    }
    # uncomment below to make a request
    #response = client.request(
    #    "POST",
    #    "/annotations/update",
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

