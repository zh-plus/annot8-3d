<template>
  <div ref="containerRef" class="viewer-container">
    <canvas ref="canvasRef"/>
    <div class="viewer-label">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, ref} from 'vue'
import {useViewer} from '@/composables/useViewer'
import {CAMERA_POSITIONS, CONTROLS, VIEWER_CONSTRAINTS} from '@/constants'
import {setupScene} from '@/utils/scene-manager'
import {useViewportStore} from '@/stores/viewport'
import {ViewerContext} from "@/types";

const props = defineProps<{
  label: string
  cameraPosition: { x: number; y: number; z: number }
}>()

const viewportStore = useViewportStore()
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewerId = props.label.toLowerCase().replace(' view', '').replace(' ', '-')

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
</style>
