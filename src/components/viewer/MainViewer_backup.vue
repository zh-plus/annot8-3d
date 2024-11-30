<template>
  <div ref="containerRef" class="viewer-container">
    <canvas ref="canvasRef"/>
    <div class="viewer-label">Main View</div>
    <div v-if="selectedTool" class="tool-indicator">
      Active Tool: {{ selectedTool.name }}
    </div>
    <ControlAnnotations v-if="viewerContext" :viewerContext="viewerContext"/>
  </div>
</template>

<script lang="ts" setup>
import {ref, watchEffect} from 'vue'
import * as THREE from 'three'
import {useToolStore, useViewportStore} from '@/stores'
import {storeToRefs} from 'pinia'
import {useViewer} from '@/composables/useViewer'
import {CAMERA_POSITIONS, CONTROLS, VIEWER_CONSTRAINTS} from '@/constants'
import {setupScene} from '@/utils/scene-manager'
import ControlAnnotations from "@/components/bounding_box/ControlAnnotations.vue";
import {ViewerContext} from "@/types";

const props = defineProps<{
  label: string
  cameraPosition: { x: number; y: number; z: number }
}>()

//containerRef 和 canvasRef 都是 Vue 3 的响应式引用，用于访问 DOM 元素（容器和画布）。它们在后续的交互和渲染中很有用。
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportStore = useViewportStore()
const viewerId = props.label.toLowerCase().replace(' view', '').replace(' ', '-')

//selectedTool 是从 toolStore 获取的当前选中的工具，它会动态显示在视图中。
const toolStore = useToolStore()
const {currentTool: selectedTool} = storeToRefs(toolStore)

// Interaction state
//isDrawing：一个布尔值，表示是否正在进行绘制操作。用来判断用户是否在绘制边界框。
const isDrawing = ref(false)
//startPoint 和 currentPoint：THREE.Vector2 类型，用于存储指针的初始位置和当前鼠标位置。
const startPoint = new THREE.Vector2()
const currentPoint = new THREE.Vector2()

//鼠标按下事件。
const onPointerDown = (event: PointerEvent) => {
  if (!selectedTool.value) return
  console.log("use type:", selectedTool.value)
  isDrawing.value = true
  const rect = canvasRef.value!.getBoundingClientRect()
  startPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  currentPoint.copy(startPoint)
}

//鼠标移动事件
const onPointerMove = (event: PointerEvent) => {
  if (!isDrawing.value || !selectedTool.value) return

  const rect = canvasRef.value!.getBoundingClientRect()
  currentPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
}

//鼠标抬起事件
const onPointerUp = () => {
  if (!isDrawing.value || !selectedTool.value) return
  isDrawing.value = false
}

// 创建响应式 viewerContext
const viewerContext = ref<ViewerContext | null>(null)
// 使用 useViewer 获取并初始化 viewerContext

useViewer({
  viewerId,
  containerRef,
  canvasRef,
  cameraPosition: props.cameraPosition,
  onInit: (context) => {
    console.log('viewerContext initialized:', context)  // 调试输出
    viewerContext.value = context  // 将初始化的 context 设置为响应式的 viewerContext

    setupScene(viewerContext.value)
    // Add event listeners
    canvasRef.value!.addEventListener('pointerdown', onPointerDown)
    canvasRef.value!.addEventListener('pointermove', onPointerMove)
    canvasRef.value!.addEventListener('pointerup', onPointerUp)

    // Single change event listener that handles camera movement
    viewerContext.value.controls.addEventListener('change', () => {
      if (viewerContext.value) {
        viewportStore.updateMainCameraState(viewerContext.value.camera, viewerContext.value.controls)
      }
    })

    // View-specific configurations
    switch (props.label) {
      case 'Main View': {
        const {x, y, z} = CAMERA_POSITIONS.main
        viewerContext.value.camera.position.set(x, y, z)
        Object.assign(viewerContext.value.controls, {
          minAzimuthAngle: Math.PI,
          maxAzimuthAngle: Math.PI,
          enableRotate: true
        })
        break
      }
      case 'Overhead View': {
        const {x, y, z} = CAMERA_POSITIONS.overhead
        viewerContext.value.camera.position.set(x, y, z)
        //viewerContext.value.camera.up.set(0, 1, 0)
        Object.assign(viewerContext.value.controls, {
          minPolarAngle: 0,
          maxPolarAngle: 0,
          enableRotate: false
        })
        break
      }
      case 'Side View': {
        const {x, y, z} = CAMERA_POSITIONS.side
        viewerContext.value.camera.position.set(x, y, z)
        Object.assign(viewerContext.value.controls, {
          minAzimuthAngle: -Math.PI / 2,
          maxAzimuthAngle: -Math.PI / 2,
          enableRotate: false
        })
        break
      }
      case 'Rear View': {
        const {x, y, z} = CAMERA_POSITIONS.rear
        viewerContext.value.camera.position.set(x, y, z)
        Object.assign(viewerContext.value.controls, {
          minAzimuthAngle: Math.PI,
          maxAzimuthAngle: Math.PI,
          enableRotate: false
        })
        break
      }
    }

    // Apply control settings
    Object.assign(viewerContext.value.controls, {
      enableDamping: CONTROLS.enableDamping,
      dampingFactor: CONTROLS.dampingFactor,
      screenSpacePanning: CONTROLS.screenSpacePanning,
      enableZoom: CONTROLS.enableZoom,
      minDistance: VIEWER_CONSTRAINTS.minDistance,
      maxDistance: VIEWER_CONSTRAINTS.maxDistance
    })
    viewportStore.registerViewerControls(viewerId, viewerContext.value.controls)
  },
  onUnmount: (context) => {
    console.log('viewerContext unmounted:', context)  // 调试输出
    viewerContext.value = null  // 在卸载时清空 viewerContext

    // Remove event listeners
    if (canvasRef.value) {
      canvasRef.value.removeEventListener('pointerdown', onPointerDown)
      canvasRef.value.removeEventListener('pointermove', onPointerMove)
      canvasRef.value.removeEventListener('pointerup', onPointerUp)
    }
  }
})

// watcher 用于确保组件每次更新时，响应式的 viewerContext 被正确传递到子组件
watchEffect(() => {
  console.log('viewerContext changed:', viewerContext.value)
})
console.log('viewerContext:', viewerContext);  // 确保 viewerContext 在此输出

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
