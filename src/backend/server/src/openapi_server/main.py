# coding: utf-8

"""
    3D Annotation API with JWT

    A JWT-Protected API for 3D Object Annotation

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from fastapi import FastAPI

from openapi_server.apis.default_api import router as DefaultApiRouter

app = FastAPI(
    title="3D Annotation API with JWT",
    description="A JWT-Protected API for 3D Object Annotation",
    version="1.0.0",
)

app.include_router(DefaultApiRouter)
