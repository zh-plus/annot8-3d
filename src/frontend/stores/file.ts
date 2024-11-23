import { defineStore } from 'pinia';
import type {File_Anno} from '../types/annotation';
import type {Annotation} from '../types/annotation'
import {useAnnotationStore} from './annotation'
import * as THREE from "three";

export const useFileStore = defineStore('files', {
  state: () => ({
    allFiles: [] as File_Anno[],  // Store for the selected file
    selectedFile:  null as File_Anno | null, // Store for the selected
  }),
  actions: {
    updateFile(files: File_Anno[]) {
      this.allFiles = files;  // Store the selected file
    },
    setSelectedFile(file:File_Anno){
      this.selectedFile = file
    },
  },
});
