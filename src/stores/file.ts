import { defineStore } from 'pinia';

export const useFileStore = defineStore('files', {
  state: () => ({
    selectedFile: null as File | null,  // Store for the selected file
  }),
  actions: {
    setSelectedFile(file: File) {
      this.selectedFile = file;  // Store the selected file
    },
  },
});
