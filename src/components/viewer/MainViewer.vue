<template>
  <div ref="containerRef" class="viewer-container">
    <canvas ref="canvasRef"/>
    <div class="viewer-label">Main View</div>
    <div v-if="selectedTool" class="tool-indicator">
      Active Tool: {{ selectedTool.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import * as THREE from 'three'
import {useToolStore, useViewportStore} from '@/stores'
import {storeToRefs} from 'pinia'
import {useViewer} from '@/composables/useViewer'
import {CAMERA_POSITIONS} from '@/constants'
import {setupScene} from '@/utils/scene-manager'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportStore = useViewportStore()

const toolStore = useToolStore()
const {currentTool: selectedTool} = storeToRefs(toolStore)

// Interaction state
const isDrawing = ref(false)
const startPoint = new THREE.Vector2()
const currentPoint = new THREE.Vector2()

const onPointerDown = (event: PointerEvent) => {
  if (!selectedTool.value) return

  isDrawing.value = true
  const rect = canvasRef.value!.getBoundingClientRect()
  startPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  currentPoint.copy(startPoint)
}

const onPointerMove = (event: PointerEvent) => {
  if (!isDrawing.value || !selectedTool.value) return

  const rect = canvasRef.value!.getBoundingClientRect()
  currentPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
}

const onPointerUp = () => {
  if (!isDrawing.value || !selectedTool.value) return
  isDrawing.value = false
}

const {viewerContext} = useViewer({
  viewerId: 'main',
  containerRef,
  canvasRef,
  cameraPosition: CAMERA_POSITIONS.main,
  onInit: (viewerContext) => {
    // Generate dummy point cloud / Load point cloud here
    setupScene(viewerContext)

    // Add event listeners
    canvasRef.value!.addEventListener('pointerdown', onPointerDown)
    canvasRef.value!.addEventListener('pointermove', onPointerMove)
    canvasRef.value!.addEventListener('pointerup', onPointerUp)

    // Single change event listener that handles camera movement
    viewerContext.controls.addEventListener('change', () => {
      viewportStore.updateMainCameraState(viewerContext.camera, viewerContext.controls)
    })
  },
  onUnmount: (viewerContext) => {
    // Remove event listeners
    if (canvasRef.value) {
      canvasRef.value.removeEventListener('pointerdown', onPointerDown)
      canvasRef.value.removeEventListener('pointermove', onPointerMove)
      canvasRef.value.removeEventListener('pointerup', onPointerUp)
    }
  }
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
}

.tool-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
}
</style>
