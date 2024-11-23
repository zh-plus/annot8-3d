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
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import {useToolStore, useViewportStore} from '@/stores'
import {storeToRefs} from 'pinia'

const toolStore = useToolStore()
const {tools} = storeToRefs(toolStore)
const {selectTool} = toolStore

const viewportStore = useViewportStore()
const {syncEnabled} = storeToRefs(viewportStore)
const {toggleSync} = viewportStore
</script>