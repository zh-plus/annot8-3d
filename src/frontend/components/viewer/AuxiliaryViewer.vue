<template>
  <div ref="containerRef" class="viewer-container">
    <canvas ref="canvasRef"/>
    <div class="viewer-label">{{ label }}</div>
    <!-- XY轴控制滑动条 -->
    <!--props.label == "front"-->
    <div v-if="annotationStore.currentBox && viewerId === fro && AnnoRange.max != AnnoRange.min">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.height"
          direction="vertical"
          :max="5"
          style="width: 10px; position: absolute; bottom: -10px; left: 10px"
      >
      </v-slider>

      <v-range-slider
          v-model="AnnoRange.range"
          :max="AnnoRange.max"
          :min="AnnoRange.min"
          class="align-center"
          hide-details
          style="width: 300px; position: absolute; bottom: 20px; left: 60px;"
          track-color="white"
          thumb-color="white"
      >
      </v-range-slider>


      <!-- 水平的 X 轴 -->
      <!--      <v-slider-->
      <!--          v-model="annotationStore.currentBox.width"-->
      <!--          :max="5"-->
      <!--          style="width: 300px; position: absolute; bottom: -10px; left: 60px;"-->
      <!--      ></v-slider>-->


      <v-slider
          v-model="annotationStore.currentBox.rotationZ"
          direction="vertical"
          :min="-1.7"
          :max="1.7"
          style="width: 300px; position: absolute; bottom: -10px; left: 280px"
      ></v-slider>
    </div>
    <div v-if="annotationStore.currentBox && viewerId === si">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.height"
          direction="vertical"
          :max="5"
          style="width: 10px; position: absolute; bottom: -10px; left: 10px"
      >
      </v-slider>
      <!-- 水平的 X 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.depth"
          :max="5"
          style="width: 300px; position: absolute; bottom: -10px; left: 60px;"
      ></v-slider>
      <v-slider
          v-model="annotationStore.currentBox.rotationX"
          direction="vertical"
          :min="-1.7"
          :max="1.7"
          style="width: 300px; position: absolute; bottom: -10px; left: 280px"
      ></v-slider>
    </div>
    <div v-if="annotationStore.currentBox && viewerId === head">
      <!-- 竖直的 Y 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.width"
          direction="vertical"
          :max="5"
          style="width: 10px; position: absolute; bottom: -10px; left: 10px"
      >
      </v-slider>
      <!-- 水平的 X 轴 -->
      <v-slider
          v-model="annotationStore.currentBox.depth"
          :max="5"
          style="width: 300px; position: absolute; bottom: -10px; left: 60px;"
      ></v-slider>
      <v-slider
          v-model="annotationStore.currentBox.rotationY"
          direction="vertical"
          :min="-1.7"
          :max="1.7"
          style="width: 300px; position: absolute; bottom: -10px; left: 280px"
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
import {useAnnoRange} from "@/stores/anno_range"

const props = defineProps<{
  label: string
  cameraPosition: { x: number; y: number; z: number }
}>()
const annotationStore = useAnnotationStore()
const viewportStore = useViewportStore()
const AnnoRange = useAnnoRange()
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewerId = props.label.toLowerCase().replace(' view', '').replace(' ', '-')
const head = "overhead";
const fro = "front";
const si = "side"
// 创建响应式 viewerContext
const viewerContext = ref<ViewerContext | null>(null)

// let range = [-5, 5]


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

// 将 Pinia 中的 range 绑定到 v-model
// const range = ref(AnnoRange.range);
// 监听 range 的变化，并更新 annotationStore
// const onRangeChange = (newRange: [number, number]) => {
//   const [left, right] = newRange;
//   AnnoRange.updateLeft(left);
//   AnnoRange.updateRight(right);
// };

watch(() => AnnoRange.range, async () => {
  console.log("Range updated:", AnnoRange.range);
  AnnoRange.updateLeft(AnnoRange.range[0]);
  AnnoRange.updateRight(AnnoRange.range[1]);
}, { deep: true });

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
