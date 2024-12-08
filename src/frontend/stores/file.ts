import { defineStore } from 'pinia';
import type {File_Anno,Folder} from '../types/annotation';
import type {Annotation} from '../types/annotation'
import {useAnnotationStore} from './annotation'
import * as THREE from "three";
import {transformData} from "../utils/file"
import axios from 'axios';
import {get_annotations} from '../utils/annotation'

export const useFileStore = defineStore('files', {
  state: () => ({
    allFolder:[] as Folder[],
    // allFiles: [] as File_Anno[],  // Store for the selected file
    selectedFile:  null as File_Anno | null, // Store for the selected
    FileListEnabled: true
  }),
  actions: {
    async initialFiles(projectId: number) {
      try {
        const token = localStorage.getItem("token");  // 从本地存储获取用户的 JWT Token
        const res_files = await axios.get(
          `http://127.0.0.1:8080/projects/projects/${projectId}/get_all_PCDFiles`,
           {
              headers: {
                  Authorization: `Bearer ${token}`, // 添加认证头部
                  "Content-Type": "application/json", // 设置请求体类型
              },
          },
      );
      // console.log('load annotation',res_annotations)
      this.allFolder=transformData(res_files['data'])

      } catch (error) {
        console.error('Failed to fetch annotations:', error);
        // You can handle errors or show a message to the user here
      }
    },
    // updateFile(files: File_Anno[]) {
    //   this.allFiles = files;  // Store the selected file
    // },
    setSelectedFile(file:File_Anno){
      this.selectedFile = file
    },
    toggleEvent() {
      this.FileListEnabled = !this.FileListEnabled
  },
    async set_file_anno(){
      
      if (this.selectedFile) {
          const path=this.selectedFile.file.file_path
          console.log(path)
          const dsPartMatch = path.match(/ds(\d+)/);
          const projPartMatch = path.match(/project_(\d+)/);
          console.log(projPartMatch)
        if (dsPartMatch && projPartMatch) {
            const dsPart = dsPartMatch[1]; // 获取 'ds0'
            // 从 'ds0' 中提取数字
            const numberMatch = dsPart.match(/\d+/);
            const projectNumber = projPartMatch[1].match(/\d+/);

            if (numberMatch && projectNumber) {
                const number = parseInt(numberMatch[0], 10); // 转为数字类型
                const project_id = parseInt(projectNumber[0], 10);
                console.log(number); // 输出: 0
                const annotations = await get_annotations(project_id,number,this.selectedFile?.file.name);//The Promise needs to be resolved before you can assign the data to this.selectedFile.annotations.
                this.selectedFile.annotations = annotations;
                console.log("get annos",this.selectedFile.annotations)
            } else {
                console.error("path format uncorrect");
            }
        } else {
            console.error("No ds_module found in the path");
          }
        }
      }
      // else{
      //   console.log("file path is not http, use local file instead")
      //   // selectedFile.file.file_path looks like ~/data/projects/project_1/ds0/pointclouds/000000.pcd
      //   // annotation path looks like ~/data/projects/project_1/ds0/annotations/000000.json
      //   if(this.selectedFile){
      //     const path=this.selectedFile.file.file_path
      //     const annotation_path=path.replace("pointclouds","annotations").replace("pcd","pcd.json")
      //   }

      // }

    // }
  },
});
