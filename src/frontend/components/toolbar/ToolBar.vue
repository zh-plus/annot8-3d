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
      const dsPartMatch = path.match(/ds(\d+)/);
      const projPartMatch = path.match(/project_(\d+)/);
      if (dsPartMatch && projPartMatch) {
          const dsNumber = dsPartMatch[1].match(/\d+/);
          const projectNumber = projPartMatch[1].match(/\d+/);
          // 从 'ds0' 和 project_0中提取数字
          if (dsNumber && projectNumber) {
            const number = parseInt(dsNumber[0], 10); // 转为数字类型
            const project_id = parseInt(projectNumber[0], 10);
              save_annotations(project_id,number,selectedFile.value?.annotations,selectedFile.value.file.name)
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