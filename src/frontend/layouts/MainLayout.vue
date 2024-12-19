<template>
  <v-app class="fill-height">
    <v-main class="fill-height pa-0">
      <div class="layout-grid">
        <!-- Toolbar -->
        <tool-bar/>
        <div class="total-section">
          <!-- Main View -->
          <div class="main-section">
            <main-viewer/>
            <div class="label-controller">
          <label-controller/>
        </div>
          </div>
          <!-- Side Views and Label Editor Container -->
          <!-- Side Views -->
          <div class="side-views" v-if="sceneCamera.scene">
            <div class="auxiliary-view-container-over">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.overhead"
                  label="Overhead View"
              />
            </div>
            <div class="auxiliary-view-container-side">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.side"
                  label="Side View"
              />
            </div>
            <div class="auxiliary-view-container-front">
              <auxiliary-viewer
                  :camera-position="viewportStore.cameraPositions.front"
                  label="Front View"
              />
            </div>
          </div>
        </div>
<!--         Label Editor -->
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
import LabelController from '@/components/label/LabelController.vue'
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
  grid-template-columns:0.8fr 0.2fr;
  grid-template-areas:
    "total_view label-edit";
  height: 100vh;
  width: calc(100vw - var(--toolbar-width));
  overflow: hidden;
  position: relative;
  margin-left: var(--toolbar-width);
}

.label-editor {
  grid-area: label-edit;
  flex: 1;
  border-left: 1px solid var(--border-color);
  height: 100%;
  overflow: hidden;
}

.total-section {
  grid-area: total_view;
  display: grid;
  grid-template-rows: 2fr 1fr;
  grid-template-areas:
  "main"
  "side-sel";
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.main-section {
  grid-area: main;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  object-fit: contain;   /* 保持等比例变化*/
  /* Remove margin */
}

.side-section {
  grid-area: side-sel;
  display: flex;
  flex-direction: row;
  height: 100%;
  border-left: 1px solid var(--border-color);
  background-color: v-bind('UI_COLORS.surface');
}

.side-views {
  grid-area: side-sel;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
  "overhead side front";
  display: grid;
  flex-direction: row;
}

.auxiliary-view-container-over {
  grid-area: overhead;
  flex: 1;
  border-bottom: 1px solid v-bind('UI_COLORS.border');
  aspect-ratio: var(calc(4 / 3));
}

.auxiliary-view-container-over:last-child {
  border-bottom: none;
}

.auxiliary-view-container-side {
  grid-area: side;
  flex: 1;
  border-bottom: 1px solid v-bind('UI_COLORS.border');
  aspect-ratio: var(calc(4 / 3));
}

.auxiliary-view-container-side:last-child {
  border-bottom: none;
}

.auxiliary-view-container-front {
  grid-area: front;
  flex: 1;
  border-bottom: 1px solid v-bind('UI_COLORS.border');
  aspect-ratio: var(calc(4 / 3));
}

.auxiliary-view-container-over:last-child {
  border-bottom: none;
}


.label-controller {
  position: absolute; /* Place it relative to .main-section */
  top: 10px; /* Adjust as needed for spacing from the top */
  left: 10px; /* Adjust as needed for spacing from the left */
  width: 400px; /* Set a fixed width for the label editor */
  height: auto; /* Adjust height as needed */
  /* background-color: rgb(0, 0, 0); Add a background to distinguish it */
  background: none; /* Remove the background */
  border: 1px solid var(--border-color); /* Optional: Add a border */
  z-index: 10; /* Ensure it is on top of other elements */
  padding: 16px; /* Optional: Add some internal padding */
  border-radius: 8px; /* Optional: Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: Add a shadow */
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