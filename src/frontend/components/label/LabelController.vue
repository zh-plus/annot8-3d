<template>
  <v-container fluid>
    <v-row no-gutters v-if="allFiles && allFiles.length">
      <!-- 文件列表 -->
      <v-col cols="4" class="file-list">
        <v-list dense>
          <v-list-item
            v-for="(file, index) in allFiles"
            :key="index"
            @click="selectFile(file)"
            :class="['custom-item', { selected: selectedFile === file }]"
          >
            <v-list-item-content>
              <v-list-item-title>{{ file.file.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- 标注结果 -->
      <v-col cols="8" class="annotation-results">
        <v-list density="compact">
          <v-list-item
            v-for="item in selectedFile?.annotations"
            :key="item.id"
            @click="annotationStore.selectAnnotation(item.id)"
            :value="item.id"
            class="px-2"
          >
            <!-- 标签名称 -->
            <v-list-item-title>{{ item.label }}</v-list-item-title>
            <!-- 删除按钮 -->
            <template v-slot:append>
              <v-btn
                class="delete-btn"
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="deleteAnnotation(item)"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <!-- 显示空提示 -->
    <v-row no-gutters v-else>
      <v-col cols="12" class="text-center">
        No files available. Please upload files.
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

const fileStore = useFileStore();//实例化
const { allFiles,selectedFile} = storeToRefs(fileStore); //解构
const annotationStore = useAnnotationStore();

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
</script>

<style scoped>
.file-list {
  overflow-y: auto; /* 启用垂直滚动条 */
  max-height: 200px; /* 限制高度，确保不会超出视口 */
  border-right: 1px solid #e0e0e0; /* 可选：添加分隔线 */
}

.annotation-results {
  overflow-y: auto; /* 启用垂直滚动条 */
  max-height: calc(100vh - 64px); /* 根据需要调整最大高度 */
}
.custom-item {
  background-color: #f5f5f5; /* 默认背景颜色 */
}

.custom-item.selected {
  background-color: #d0eaff; /* 选中时的背景颜色 */
  color: #003366; /* 可选：选中状态的文字颜色 */
}
</style>