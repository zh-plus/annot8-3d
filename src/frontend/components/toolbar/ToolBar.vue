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
    if (selectedFile.value != null){
      console.log(selectedFile)
      console.log('ddddddddddddd',+selectedFile.value?.annotations)
      save_annotations(0,selectedFile.value?.annotations)
    }
  }
});




</script>