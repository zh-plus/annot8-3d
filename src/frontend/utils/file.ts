import type {File_Anno,Folder} from '../types/annotation';
import type {Vector3} from 'three'



export function transformData(apiResponse_file: any): Folder[] {
    const folderData: Folder[] = Object.entries(apiResponse_file).map(([folderPath, files]) => {
      // Extract folder id (e.g., ds0 from the path)
      const folderId = folderPath.split("\\").pop() || "";  // Extract the last part of the path
      const srcIndex = folderPath.indexOf("src");
      const relativePath = folderPath.substring(srcIndex);//获取相对路径
      const updatedPath =relativePath.replace(/\\/g, "/");//替换 '\' 为'/'
      
      // Create the folder object
      const folder: Folder = {
        id: folderId,
        files: (files as string[]).map((fileName: string) => {//明确一下file类型
          // Create File_Anno object for each file
          const file: File_Anno = {
            file:{name:fileName,file_path: updatedPath+'/pointcloud/'+fileName},
            annotations: []  // No annotations in this example, could be filled later
          };
          return file;
        })
      };
      
      return folder;
    });
  
    return folderData;
  }

