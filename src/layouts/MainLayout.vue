<template>
  <v-app class="fill-height">
    <v-main class="fill-height pa-0">
      <div class="layout-grid">
        <!-- Image Display Section -->
        <div class="image-display">
          <img :src="imageSrc" alt="Selected Image" class="image" v-if="imageSrc" />
        </div>
        <!-- Toolbar -->
        <tool-bar/>

        <!-- Main View -->
        <div class="main-section">
          <main-viewer/>
          <!-- Label controller-->
        <div class="label-controller">
          <label-controller/>
        </div>

        </div>

        <!-- Side Views and Label Editor Container -->
        <div class="side-section">
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
                  :camera-position="viewportStore.cameraPositions.rear"
                  label="Rear View"
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
import {ref} from 'vue'
import ToolBar from '@/components/toolbar/ToolBar.vue'
import MainViewer from '@/components/viewer/MainViewer.vue'
import AuxiliaryViewer from '@/components/viewer/AuxiliaryViewer.vue'
import LabelEditor from '@/components/label/LabelEditor.vue'
import {useViewportStore} from '@/stores'
import {UI_COLORS} from "@/constants" // Used in <style> v-bind
import LabelController from '@/components/label/LabelController.vue'

const viewportStore = useViewportStore()
const {lgAndUp, mdAndDown} = useDisplay()

// 暂时不考虑显示图片的功能
const imageSrc = ref<string | null>(null);
// imageSrc.value = "src/assets/PCD_cloud/drive_33_north_to_south/images/vehicle_camera_basler_16mm/1688625741_452205488_vehicle_camera_basler_16mm.jpg"; 

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

.image-display {
  position: absolute;
  bottom: 10px; /* 调整图像到左上角的距离 */
  left: 10px;
  z-index: 1; /* 确保图像在其他元素上方 */
  background: rgba(0, 0, 0, 0.6); /* 可选：添加背景遮罩 */
  padding: 5px; /* 可选：内边距 */
  border-radius: 8px; /* 可选：圆角效果 */
}

.image {
  max-width: 400px; /* 限制图像宽度 */
  max-height: 250px; /* 限制图像高度 */
  object-fit: contain; /* 保持图像比例 */
  border: 1px solid var(--border-color); /* 可选：添加边框 */
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