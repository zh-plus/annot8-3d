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
    
    async def get_annotations(self, project_id: int, episode_id: int, file_name: str):
        """
        Fetch and return the content of a specific annotation JSON file.
        """
        # Define the annotations directory path
        annots_dir = PROJECT_ROOT / 'data' / 'projects' / f'project_{project_id}' / f'ds{episode_id}' / 'ann'
        annot_file = annots_dir / f"{file_name}.json"

        # Check if the JSON file exists
        if not annot_file.exists():
            logger.error(f"Annotation file not found: {annot_file}")
            raise HTTPException(status_code=404, detail=f"Annotation file not found: {file_name}")

        # Load and return the content of the JSON file
        try:
            with open(annot_file, 'r') as f:
                content = json.load(f)  # Load the JSON content as a dictionary
                annotations = [Annotation(**item) for item in content]
            logger.info(f"Successfully loaded annotation file: {annot_file}")
            return annotations  # FastAPI will automatically return this as JSON
        except Exception as e:
            logger.error(f"Error reading annotation file {annot_file}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error reading annotation file: {file_name}")

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
    
    async def save_annotations(self, project_id: int, episode_id: int,annotations):
        print('ok')
        annots_dir = PROJECT_ROOT / 'data' / 'projects'/ f'project_{project_id}' / f'ds{episode_id}' / 'ann'
        file_id = annotations[0].pcd_file_id
        annot_file = annots_dir / f"{file_id}.json"
        print(annot_file)
        if not annots_dir.exists():
            logger.error(f"Annotations directory not found: {annots_dir}")
            raise HTTPException(status_code=404, detail="Project or Episode not found")
            
        else:
            try:
                with open(annot_file, 'w') as f:
                    # add one annotation to the file
                    # data = json.load(f)
                    all_annotations = [annotation.to_dict() for annotation in annotations]
                    
                    json.dump(all_annotations, f, indent=4)
                    print('save successfully')
                        
                    # annot = json.loads(annotation.to_json())
                    # json.dump(annot, f, indent=4)
                    # print('save successfully')
                    return True
                    # annot['id'] = len(data["objects"]) + 1
                    
                    # data["objects"].append(annot)
                    # json.dump(data, f, indent=4)
                    # new_annot = Annotation.from_dict(annot)
                    # return new_annot
                
            except Exception as e:
                logger.error(f"Error savine annotation file {annot_file.name}: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error savine annotation file {annot_file.name}")

        