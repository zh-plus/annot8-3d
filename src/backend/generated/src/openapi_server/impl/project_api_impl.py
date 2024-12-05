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
        annots_dir = PROJECT_ROOT / 'data' / 'projects'/ f'project_{project_id}' 

        # Check if the annotations directory exists
        if not annots_dir.exists():
            logger.error(f"project directory not found: {annots_dir}")
            raise HTTPException(status_code=404, detail="Project not found")

        folders = {} # 这里是不是可以再定义一个类去优化
        print(annots_dir)
        # Iterate through all the JSON files in the directory
        try:
            folders = [os.path.join(annots_dir, name) for name in os.listdir(annots_dir) 
                if os.path.isdir(os.path.join(annots_dir, name)) and name.startswith('ds')]

            all_files = {}  # 用于存储每个子文件夹中的文件
            for folder in folders:
                print(folder)
                # 获取子文件夹中的文件
                files = [f for f in os.listdir(os.path.join(folder,'pointcloud'))]
                all_files[folder] = files  # 存储文件夹路径和文件列表
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading pcd file ")

        # Log success for debugging purposes (without printing the entire content)
        # logger.info(f"Successfully merged {len(annotations)} annotation files from {annots_dir}")

        return all_files
    
    async def get_labels(self, project_id: int):
        label_dir = PROJECT_ROOT / 'data' / 'projects'/ f'project_{project_id}' /'meta.json'

        # Check if the annotations directory exists
        if not label_dir.exists():
            logger.error(f"label directory not found: {label_dir}")
            raise HTTPException(status_code=404, detail="label not found")

        labels = []
            # Iterate through all the JSON files in the directory
        try:
            with open(label_dir, 'r') as f:
                # Load the content of the JSON file
                content = json.load(f)
                # Use the JSON filename (without extension) as the key
                labels = content.get("classes", [])

        except Exception as e:
            logger.error(f"Error reading label file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading label file ")


        # Log success for debugging purposes (without printing the entire content)
        logger.info(f"Successfully merged {len(labels)} annotation files from {label_dir}")

        return labels