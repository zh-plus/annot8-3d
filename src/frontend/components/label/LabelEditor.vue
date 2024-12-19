<template>
  <v-container fluid>
 <!-- <v-container fluid v-if="FileListEnabled">
   <file-manager/> -->
   <v-row no-gutters> 
     <!-- 文件列表 -->
     <v-col cols="12" class="file-list">
       <v-list nav>
         <!-- 遍历文件夹数组 -->
         <v-list-group
           v-for="label in labels"
           :key="label.id"
           :value="label.id"
         >
           <!-- 一级目录（文件夹） -->
           <template v-slot:activator="{ props }">
             <v-list-item 
               v-bind="props"
               :title="label.name"
               @mouseenter="label.BBox.map((bbox) => {highlightBBox(bbox.bbox)});"
               @mouseleave="label.BBox.map((bbox) => {resetBBoxColor(bbox.bbox)});"
             ></v-list-item>
           </template>
           
           <!-- 二级目录（文件） -->
           <v-list-item 
             v-for="bbox in label.BBox"
             :key="bbox.id"
             :title="bbox.id"
             :value="bbox.id"
             @mouseenter="highlightBBox(bbox.bbox)"
             @mouseleave="resetBBoxColor(bbox.bbox)"
             
           ></v-list-item>
         </v-list-group>
       </v-list>
     </v-col>
   </v-row>
 </v-container>
 
 </template>
 
 
 <script setup lang="ts">
 import { ref, watch} from 'vue';
 import { storeToRefs } from 'pinia';
 import { useFileStore } from '@/stores/file.ts'; 
 import { File_Anno } from '@/types';
 import { useAnnotationStore } from '@/stores';
//  import FileManager from '../toolbar/FileManager.vue';
 import { useLabelStore } from '@/stores';
 import * as THREE from 'three';
 
 const fileStore = useFileStore();//实例化
 const { allFolder,selectedFile,FileListEnabled} = storeToRefs(fileStore); //解构
 const annotationStore = useAnnotationStore();

 const labelStore = useLabelStore();
 const { labels} = storeToRefs(labelStore); //解构

 
 // 选择文件
 const selectFile = (file: File_Anno) => {
   fileStore.setSelectedFile(file)
 };
 
 // 查看标注
 const viewAnnotation = (annotation: any) => {
   alert(`查看标注: ${annotation.label}`);
 };
 
 // 删除标注
 const deleteAnnotation = (annotation: any) => {
    annotationStore.removeAnnotation(annotation.id); // 删除该标注
 };


 // 鼠标悬停时高亮
const highlightBBox = (bbox: THREE.LineSegments) => {
  if (bbox.material) {
    const material = bbox.material as THREE.Material; // 假设材质是可以转换的
    if ('color' in material) {
      const originalColor =  (material as THREE.LineBasicMaterial).color.clone(); // 保存原始颜色
      (bbox.userData as any).originalColor = originalColor; // 存储到 userData 中
      (material as THREE.LineBasicMaterial).color.set(0xffff00); // 设置高亮颜色（亮黄色）
    }
  }
};

// 鼠标移开时重置颜色
const resetBBoxColor = (bbox: THREE.LineSegments) => {
  if (bbox.material) {
    const material = bbox.material as THREE.Material;
    if ('color' in material) {
      const originalColor = (bbox.userData as any).originalColor;
      if (originalColor) {
        (material as THREE.LineBasicMaterial).color.copy(originalColor); // 恢复原始颜色
      }
    }
  }
};

 </script>
 
 <style scoped>
 .v-container {
   width: 10000vh; /* 确保行占满父容器 */
   height: 100vh; /* 确保行占满父容器 */
   padding: 0;
   background-color: white;
   border-radius: 2px;
 }

 .v-row {
  width: 100%;
  height: 100%; /* 确保行占满父容器 */
  margin: 0;
}

.v-col {
  width:100%;
  height: 100%; /* 列也占满父容器 */
  overflow: auto; /* 内容超出时滚动 */
}

 
.file-list {
  overflow-y: auto; /* 保留滚动条 */
  max-height: calc(100vh ); /* 适配视口高度 */
  max-width: calc(100vh); /* 适配视口高度 */
  background-color: #f5f5f5; /* 背景颜色 */
  border-right: none; /* 移除分隔线 */
}
 
 .annotation-results {
   overflow-y: auto; /* 启用垂直滚动条 */
   max-height: calc(100vh - 64px); /* 根据需要调整最大高度 */
 }
 .file-list {
   background-color: #f5f5f5; /* 默认背景颜色 */
 }
 
 .file-list.selected {
   background-color: #d0eaff; /* 选中时的背景颜色 */
   color: #003366; /* 可选：选中状态的文字颜色 */
 }
 </style>