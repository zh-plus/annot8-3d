import json
import logging
from openapi_server.apis.default_api_base import BaseDefaultApi
from openapi_server.models.annotation_request import AnnotationRequest
from openapi_server.models.annotation import Annotation
from pathlib import Path as FilePath
from fastapi import HTTPException

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = FilePath(__file__).parent.parent.parent.parent.parent   

class AnnotationApiImpl(BaseDefaultApi):
    
    async def get_annotations(self, project_id: int, episode_id: int):
        # Define the annotations directory path
        annots_dir = PROJECT_ROOT / 'data' / 'projects'/ f'project_{project_id}' / f'ds{episode_id}' / 'ann'

        # Check if the annotations directory exists
        if not annots_dir.exists():
            logger.error(f"Annotations directory not found: {annots_dir}")
            raise HTTPException(status_code=404, detail="Project or Episode not found")

        annotations = {}
        print(annots_dir)
        # Iterate through all the JSON files in the directory
        try:
            for json_file in annots_dir.glob("*.json"):
                try:
                    with open(json_file, 'r') as f:
                        # Load the content of the JSON file
                        content = json.load(f)
                        # Use the JSON filename (without extension) as the key
                        annotations[json_file.stem] = content
                except Exception as e:
                    logger.error(f"Error reading annotation file {json_file.name}: {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Error reading annotation file {json_file.name}")

        except Exception as e:
            logger.error(f"Unexpected error when processing annotations: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

        # Log success for debugging purposes (without printing the entire content)
        logger.info(f"Successfully merged {len(annotations)} annotation files from {annots_dir}")

        return annotations

    async def create_annotation(self, project_id: int, episode_id: int, annotation_request):

        annots_dir = PROJECT_ROOT / 'data' / 'projects'/ f'project_{project_id}' / f'ds{episode_id}' / 'ann'
        file_id = annotation_request.pcd_file_id
        annot_file = annots_dir / f"{file_id}.json"
        if not annots_dir.exists():
            logger.error(f"Annotations directory not found: {annots_dir}")
            raise HTTPException(status_code=404, detail="Project or Episode not found")

        else:
            try:
                with open(annot_file, 'w') as f:
                    # add one annotation to the file
                    data = json.load(f)
                    annot = annotation_request.to_dict()
                    annot['id'] = len(data["objects"]) + 1
                    
                    data["objects"].append(annot)
                    json.dump(data, f, indent=4)
                    new_annot = Annotation.from_dict(annot)
                    return new_annot
                
            except Exception as e:
                logger.error(f"Error writing annotation file {annot_file.name}: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error writing annotation file {annot_file.name}")

        return annotation_request