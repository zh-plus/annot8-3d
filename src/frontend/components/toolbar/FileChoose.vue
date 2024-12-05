<template>
  <!-- File Selector (Hidden) -->
  <input
    ref="fileInput"
    type="file"
    style="display: none"
    multiple 
    @change="handleFileSelect"
  />
</template>
  

<script setup lang="ts">
import * as THREE from "three";
import { ref, watch } from 'vue';
import { useToolStore } from '@/stores'; // 引入 Pinia store
import { storeToRefs } from 'pinia';
import { useFileStore } from '@/stores/file.ts'; 
import { File_Anno } from '../../types/annotation'; // Import the File_Anno interface

const toolStore = useToolStore(); // 获取 store 实例
const { selectedTool } = storeToRefs(toolStore); // 获取选中的工具
const fileStore = useFileStore();

// 文件选择器的引用
const fileInput = ref<HTMLInputElement | null>(null);

// 监听工具选择
watch(selectedTool, (newTool) => {
  if (newTool && newTool === 'file') {
    console.log('True')
    openFilePicker();  // 当选中 folder 工具时打开文件选择器
    toolStore.selectTool('file');
  }
  else{ console.log('false')}
});

// 打开文件选择器
const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click();  // 触发文件选择器点击事件
  }
};

// 批量文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    const selectedFiles = Array.from(input.files);
    console.log('选择的文件:', selectedFiles);
    // 转化成File_Anno格式
    const fileAnnoArray: File_Anno[] = selectedFiles.map(file => ({
      file,
      annotations: [] // 初始化空数组
    }));
    
    // fileStore.updateFile(fileAnnoArray);
  }
};

</script>

