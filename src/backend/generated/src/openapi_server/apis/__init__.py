from fastapi import APIRouter
from .project_api import router as project_router
from .annotation_api import router as annotation_router
from .user_api import router as user_router

router = APIRouter()

# Assuming `router` is defined as APIRouter() in each file
router.include_router(project_router, prefix="/projects")
router.include_router(annotation_router, prefix="/annotations")
router.include_router(user_router, prefix="")
