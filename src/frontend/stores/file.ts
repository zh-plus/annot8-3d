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
          "http://127.0.0.1:8080/projects/projects/0/get_all_PCDFiles",
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
      const annotations = await get_annotations(0); //The Promise needs to be resolved before you can assign the data to this.selectedFile.annotations.
       if (this.selectedFile) {
        this.selectedFile.annotations = annotations;
        console.log("get annos",this.selectedFile.annotations)
      }

    }
  },
});
