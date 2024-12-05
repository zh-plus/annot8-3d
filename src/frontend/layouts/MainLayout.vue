<template>
  <v-app class="fill-height">
    <v-main class="fill-height pa-0">
      <div class="layout-grid">
        <!-- Toolbar -->
        <tool-bar/>

        <!-- Main View -->
        <div class="main-section">
          <main-viewer/>
            <!-- Label controller-->
        <div class="label-controller">
          <label-controller/>
        </div>

        </div >
        <div id="sideLabel" style="position: absolute; top: 2%; left: 74%; color: white; font-size: 14px;">Side View
        </div>
        <div id="headLabel" style="position: absolute; top: 35%; left: 74%; color: white; font-size: 14px;">Head View
        </div>
        <div id="rearLabel" style="position: absolute; top: 68%; left: 74%; color: white; font-size: 14px;">Rear View
        </div>
        
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
import LabelEditor from '@/components/label/LabelEditor.vue'
import {useViewportStore} from '@/stores'
import LabelController from '@/components/label/LabelController.vue'
import {UI_COLORS} from "@/constants" // Used in <style> v-bind

const viewportStore = useViewportStore()
const {lgAndUp, mdAndDown} = useDisplay()
</script>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: calc(100% - var(--label-editor-width)) var(--label-editor-width);
  grid-template-areas: "main label-edit";

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

.label-controller {
  position: absolute; /* Place it relative to .main-section */
  top: 10px; /* Adjust as needed for spacing from the top */
  left: 10px; /* Adjust as needed for spacing from the left */
  width: 400px; /* Set a fixed width for the label editor */
  height: auto; /* Adjust height as needed */
  background-color: white; /* Add a background to distinguish it */
  border: 1px solid var(--border-color); /* Optional: Add a border */
  z-index: 10; /* Ensure it is on top of other elements */
  padding: 16px; /* Optional: Add some internal padding */
  border-radius: 8px; /* Optional: Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: Add a shadow */
}
.label-editor {
  width: var(--label-editor-width);
  grid-area: label-edit;
  flex: 1;
  border-left: 1px solid var(--border-color);
}

/* Responsive layouts */
@media (max-width: 1280px) {
  .layout-grid {
    grid-template-columns: calc(100%);
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
    grid-template-rows: 1fr;
    grid-template-areas:
      "main";
    margin-left: var(--toolbar-width);
  }

}

@media (max-width: 600px) {
  .layout-grid {
    margin-left: 0;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "toolbar"
      "main";
  }
}
</style>