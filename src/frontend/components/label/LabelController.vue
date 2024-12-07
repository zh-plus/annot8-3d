<template>
 <v-container fluid v-if="allFolder && allFolder.length && FileListEnabled">
  <v-row no-gutters>
    <!-- 文件列表 -->
    <v-col cols="6" class="file-list">
      <v-list nav>
        <!-- 遍历文件夹数组 -->
        <v-list-group
          v-for="folder in allFolder"
          :key="folder.id"
          :value="folder.id"
        >
          <!-- 一级目录（文件夹） -->
          <template v-slot:activator="{ props }">
            <v-list-item 
              v-bind="props"
              :title="folder.id"
            ></v-list-item>
          </template>
          
          <!-- 二级目录（文件） -->
          <v-list-item 
            v-for="file in folder.files"
            :key="file.file.name"
            :title="file.file.name"
            :value="file.file.name"
            @click="selectFile(file)" 
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-col>

    <!-- 标注结果 -->
    <v-col cols="6" class="annotation-results">
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
          <!-- <template v-slot:append>
            <v-btn
              class="delete-btn"
              icon="mdi-delete"
              size="small"
              variant="text"
              @click="deleteAnnotation(item)"
            />
          </template> -->
        </v-list-item>
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

const fileStore = useFileStore();//实例化
const { allFolder,selectedFile,FileListEnabled} = storeToRefs(fileStore); //解构
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
.file-list {
  background-color: #f5f5f5; /* 默认背景颜色 */
}

.file-list.selected {
  background-color: #d0eaff; /* 选中时的背景颜色 */
  color: #003366; /* 可选：选中状态的文字颜色 */
}
</style>