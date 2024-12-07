<template>
  <v-navigation-drawer permanent width="56">
    <v-list nav>
      <v-list-item
          v-for="tool in tools"
          :key="tool.id"
          :active="tool.active"
          :value="tool.id"
          @click="selectTool(tool.id)"
      >
        <template v-slot:prepend>
          <v-icon :icon="tool.icon"/>
        </template>

        <v-tooltip
            activator="parent"
            location="right"
        >
          {{ tool.name }}
        </v-tooltip>
      </v-list-item>

      <!-- Sync Toggle -->
      <v-list-item @click="toggleSync">
        <template v-slot:prepend>
          <v-icon :icon="syncEnabled ? 'mdi-sync' : 'mdi-sync-off'"/>
        </template>

        <v-tooltip
            activator="parent"
            location="right"
        >
          {{ syncEnabled ? 'Disable View Sync' : 'Enable View Sync' }}
        </v-tooltip>
      </v-list-item>

      <v-list-item @click="toggleEvent">
        <template v-slot:prepend>
          <v-icon :icon="FileListEnabled ? 'mdi-eye' : 'mdi-eye-off'"/>
        </template>

        <v-tooltip
            activator="parent"
            location="right"
        >
          {{ FileListEnabled ? 'Disable FileList' : 'Enable FileList' }}
        </v-tooltip>
      </v-list-item>


    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import {useToolStore, useViewportStore,useLabelStore} from '@/stores'
import {useFileStore} from '@/stores/file'
import {storeToRefs} from 'pinia'
import {  watch } from 'vue';
import { save_annotations} from '@/utils/annotation'

const toolStore = useToolStore()
const {tools} = storeToRefs(toolStore)
const {selectTool} = toolStore
const {selectedTool}=storeToRefs(toolStore)

const labelStore = useLabelStore()

const viewportStore = useViewportStore()
const {syncEnabled} = storeToRefs(viewportStore)
const {toggleSync} = viewportStore
const fileStore = useFileStore()
const {FileListEnabled,selectedFile} = storeToRefs(fileStore)
const {toggleEvent} = fileStore


watch(selectedTool, (newTool) => {
  if (newTool && newTool === 'save') {
    console.log('choose save')
    selectTool(newTool)
    if (selectedFile.value != null){
      const path=selectedFile.value.file.file_path
      const dsPartMatch = path.match(/\/(ds\d+)\//);
      if (dsPartMatch) {
          const dsPart = dsPartMatch[1]; // 获取 'ds0'
          // 从 'ds0' 中提取数字
          const numberMatch = dsPart.match(/\d+/);
          if (numberMatch) {
              const number = parseInt(numberMatch[0], 10); // 转为数字类型
              console.log(number); // 输出: 0
              save_annotations(0,number,selectedFile.value?.annotations,selectedFile.value.file.name)
          } else {
              console.error("path format uncorrect");
          }
      } else {
          console.error("No ds_module found in the path");
    }
  }
}
});




</script>