<template>
  <div ref="containerRef" class="viewer-container">
    <canvas ref="canvasRef"/>
    <div class="viewer-label">{{ label }}</div>
    <!-- XY轴控制滑动条 -->
    <!--props.label == "front"-->
    <div v-if="annotationStore.currentBox && viewerId === fro">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.height"
          direction="vertical"
          :max="5"
          style="height: 40px; width: 20px; position: absolute; bottom: 270px; left: 20px;"
      >
      </v-slider>
      <!-- 水平的 X 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.width"
          :max="5"
          style="width: 300px; position: absolute; bottom: -10px; left: 40px;"
      ></v-slider>
    </div>
    <div v-if="annotationStore.currentBox && viewerId === si">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.height"
          direction="vertical"
          :max="5"
          style="height: 40px; width: 20px; position: absolute; bottom: 270px; left: 20px;"
      >
      </v-slider>
      <!-- 水平的 X 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.depth"
          :max="5"
          style="width: 300px; position: absolute; bottom: -10px; left: 40px;"
      ></v-slider>
    </div>
    <div v-if="annotationStore.currentBox && viewerId === head">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.width"
          direction="vertical"
          :max="5"
          style="height: 40px; width: 20px; position: absolute; bottom: 270px; left: 20px;"
      >
      </v-slider>
      <!-- 水平的 X 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.depth"
          :max="5"
          style="width: 300px; position: absolute; bottom: -10px; left: 40px;"
      ></v-slider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, ref, watch} from 'vue'
import {useViewer} from '@/composables/useViewer'
import {CAMERA_POSITIONS, CONTROLS, VIEWER_CONSTRAINTS} from '@/constants'
import {setupScene} from '@/utils/scene-manager'
import {useViewportStore} from '@/stores/viewport'
import {ViewerContext} from "@/types"
import {useAnnotationStore} from "@/stores";

const props = defineProps<{
  label: string
  cameraPosition: { x: number; y: number; z: number }
}>()
const annotationStore = useAnnotationStore()
const viewportStore = useViewportStore()
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewerId = props.label.toLowerCase().replace(' view', '').replace(' ', '-')
const head = "overhead";
const fro = "front";
const si = "side"
// 创建响应式 viewerContext
const viewerContext = ref<ViewerContext | null>(null)


useViewer({
  viewerId,
  containerRef,
  canvasRef,
  cameraPosition: props.cameraPosition,
  onInit: (context) => {
    viewerContext.value = context
    setupScene(viewerContext.value, 'None')
  }
})

onUnmounted(() => {
  viewportStore.unregisterViewerControls(viewerId)
})
</script>

<style scoped>
.viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  background-color: #1a1a1a;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.viewer-label {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white;
  font-size: 14px;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
}

/* XY轴控制 */

.custom-label {
  color: red; /* 设置文字颜色 */
  font-size: 18px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体加粗 */
  text-transform: uppercase; /* 设置文字全大写 */
}


</style>
