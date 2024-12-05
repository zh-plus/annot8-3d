<template>
  <v-app class="fill-height">
    <v-main class="fill-height pa-0">
      <div class="layout-grid">
        <!-- Toolbar -->
        <tool-bar/>

        <!-- Main View -->
        <div class="main-section">
          <main-viewer/>
        </div>

        <!-- Side Views and Label Editor Container -->
        <div class="side-section" v-if="sceneCamera.scene">
          <!-- Side Views -->
          <div class="side-views">
            <div class="auxiliary-view-container">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.overhead"
                  label="Overhead View"
              />
            </div>
            <div class="auxiliary-view-container">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.side"
                  label="Side View"
              />
            </div>
            <div class="auxiliary-view-container">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.front"
                  label="Front View"
              />
            </div>
          </div>
        </div>
        <!-- Label Editor -->
        <div class="label-editor">
          <label-editor/>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {useDisplay} from 'vuetify'
import ToolBar from '@/components/toolbar/ToolBar.vue'
import MainViewer from '@/components/viewer/MainViewer.vue'
import AuxiliaryViewer from '@/components/viewer/AuxiliaryViewer.vue'
import LabelEditor from '@/components/label/LabelEditor.vue'
import {useViewportStore} from '@/stores'
import {useSceneCamera} from '@/stores/scene_camera_control'
import {UI_COLORS} from "@/constants" // Used in <style> v-bind

const viewportStore = useViewportStore()
const sceneCamera = useSceneCamera()
const {lgAndUp, mdAndDown} = useDisplay()
</script>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: calc(100% - var(--side-view-width) - var(--label-editor-width)) var(--side-view-width) var(--label-editor-width);
  grid-template-areas: "main side label-edit";
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  margin-left: var(--toolbar-width);
}

.main-section {
  grid-area: main;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* Remove margin */
}

.side-section {
  grid-area: side;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid var(--border-color);
  background-color: v-bind('UI_COLORS.surface');
}

.side-views {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.auxiliary-view-container {
  flex: 1;
  border-bottom: 1px solid v-bind('UI_COLORS.border');
  aspect-ratio: var(--aspect-ratio);
}

.auxiliary-view-container:last-child {
  border-bottom: none;
}

.label-editor {
  grid-area: label-edit;
  flex: 1;
  border-left: 1px solid var(--border-color);
}

/* Responsive layouts */
@media (max-width: 1280px) {
  .layout-grid {
    grid-template-columns: calc(100% - var(--side-view-width)) var(--side-view-width);
    grid-template-areas: "main side";
  }

  .label-editor {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: var(--label-editor-width);
    background: var(--surface-color);
    z-index: 100;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .label-editor.active {
    transform: translateX(0);
  }
}

@media (max-width: 960px) {
  .layout-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr;
    grid-template-areas:
      "main"
      "side";
    margin-left: var(--toolbar-width);
  }

  .side-section {
    border-left: none;
    border-top: 1px solid var(--border-color);
    flex-direction: row;
  }

  .side-views {
    flex-direction: row;
    flex: 3;
  }

  .auxiliary-view-container {
    border-bottom: none;
    border-right: 1px solid var(--border-color);
  }
}

@media (max-width: 600px) {
  .layout-grid {
    margin-left: 0;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "toolbar"
      "main"
      "side";
  }

  .side-section {
    height: 300px;
  }
}
</style>