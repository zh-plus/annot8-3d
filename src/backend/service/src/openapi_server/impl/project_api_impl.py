import json
import logging
from typing import Dict
from openapi_server.apis.default_api_base import BaseDefaultApi
from pathlib import Path as FilePath
from fastapi import HTTPException
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = FilePath(__file__).parent.parent.parent.parent.parent


class ProjectApiImpl(BaseDefaultApi):

    async def get_all_PCDFiles(self, project_id: int):
        # Define the annotations directory path
        # TODO 考虑如何更好的组织文件夹结构
        # 我们应该将用户的所有project都放在一个文件夹下，然后根据user_id去找到对应的用户文件夹
        # 例如/data/{user_id}/projects/{project_id}/
        # 这样可以更好的组织文件夹结构，而不是将所有的project都放在一个文件夹下
        annots_dir = PROJECT_ROOT / "data" / "projects" / f"project_{project_id}"

        # Check if the annotations directory exists
        if not annots_dir.exists():
            logger.error(f"project directory not found: {annots_dir}")
            raise HTTPException(status_code=404, detail="Project not found")

        folders = (
            {}
        )  # 这里是不是可以再定义一个类去优化：我们可以暂时不考虑这个问题，先把功能实现了
        # 一个dict结构也可以很好的描述这个文件夹
        print(annots_dir)
        # Iterate through all the JSON files in the directory
        try:
            folders = [
                os.path.join(annots_dir, name)
                for name in os.listdir(annots_dir)
                if os.path.isdir(os.path.join(annots_dir, name))
                and name.startswith("ds")
            ]

            all_files = (
                {}
            )  # 用于存储每个子文件夹中的文件: 我们只存储文件的路径而不是真实的文件内容
            # 得到路径（比如文件夹路径或者URL），我们在渲染PCD的时候才回去获取和渲染

            for folder in folders:
                print(folder)
                # 获取子文件夹中的文件
                files = [f for f in os.listdir(os.path.join(folder, "pointcloud"))]
                all_files[folder] = files  # 存储文件夹路径和文件列表
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading pcd file ")

        # Log success for debugging purposes (without printing the entire content)
        # logger.info(f"Successfully merged {len(annotations)} annotation files from {annots_dir}")

        return all_files

    async def list_projects(self):
        projects_dir = PROJECT_ROOT / "data" / "projects"
        if not projects_dir.exists():
            logger.error(f"project directory not found: {projects_dir}")
            raise HTTPException(status_code=404, detail="Project list not found")

        folder = {}
        folder["projects"] = []
        try:
            projects = [
                os.path.join(projects_dir, name)
                for name in os.listdir(projects_dir)
                if os.path.isdir(os.path.join(projects_dir, name))
                and name.startswith("project_")
            ]

            for project in projects:
                proj_dict = {}
                proj_dict = {"name": project.split("/")[-1], "Episodes": []}
                episodes = [
                    os.path.join(project, name)
                    for name in os.listdir(project)
                    if os.path.isdir(os.path.join(project, name))
                    and name.startswith("ds")
                ]

                for episode in episodes:
                    episode_dict = {
                        "name": episode.split("/")[-1],
                        "pointcloudFiles": [],
                    }
                    pointcloud_dir = os.path.join(episode, "pointcloud")
                    if os.path.exists(pointcloud_dir):
                        pcds = [
                            f for f in os.listdir(pointcloud_dir) if f.endswith(".pcd")
                        ]
                        for pcd in pcds:
                            episode_dict["pointcloudFiles"].append(os.path.join(pointcloud_dir, pcd))
                    proj_dict["Episodes"].append(episode_dict)
                folder["projects"].append(proj_dict)

        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

        return folder

    async def get_labels(self, project_id: int):
        label_dir = (
            PROJECT_ROOT / "data" / "projects" / f"project_{project_id}" / "meta.json"
        )
        print(label_dir)
        # Check if the annotations directory exists
        if not label_dir.exists():
            logger.error(f"label directory not found: {label_dir}")
            raise HTTPException(status_code=404, detail="label not found")

        labels = []
        # Iterate through all the JSON files in the directory
        try:
            with open(label_dir, "r") as f:
                # Load the content of the JSON file
                content = json.load(f)
                # Use the JSON filename (without extension) as the key
                labels = content.get("classes", [])

        except Exception as e:
            logger.error(f"Error reading label file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading label file ")

        # Log success for debugging purposes (without printing the entire content)
        logger.info(
            f"Successfully merged {len(labels)} annotation files from {label_dir}"
        )

        return labels
