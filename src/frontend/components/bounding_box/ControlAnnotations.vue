<script setup lang="ts">
import * as THREE from "three";
import {useRaycaster} from "@/composables/useViewerContext.ts";
import {computed, nextTick, PropType, reactive, ref, watch, watchEffect} from "vue";
import type {ViewerContext} from "@/types";
import type {BoxPosition, BoxDimensions, BoxRotation} from "@/stores/types"
import {useAnnotationStore, useToolStore, useViewportStore} from "@/stores";
import {useSceneCamera} from "@/stores/scene_camera_control"
import {onMounted, onBeforeUnmount} from 'vue'
import {VCard, VTextField, VSlider} from 'vuetify/components';

const props = defineProps({
  viewerContext: {
    type: Object as PropType<ViewerContext>,
    required: true
  }
})
const emit = defineEmits<{
  (s: "isDrag", status: boolean | undefined): void
}>()
nextTick(() => {
  watchEffect(() => {
    emit('isDrag', isDrag())
  })
})

const annotationStore = useAnnotationStore()
const sceneCamera = useSceneCamera()
const viewportStore = useViewportStore()
let currentlySelectedBox: THREE.LineSegments | null = null;
let seal_sphere: THREE.Mesh | null | undefined = null;
const currentBox = computed(() => annotationStore.currentBox);
const scene = props.viewerContext.scene

const isKeyAPressed_a = ref(false)
const isKeyAPressed_d = ref(false)
const showControlPanel = ref(false)

const boxDimensions = reactive<BoxDimensions>({
  width: currentBox.value?.width || 1,
  height: currentBox.value?.height || 1,
  depth: currentBox.value?.depth || 1
});
const boxPosition = reactive<BoxPosition>({
  x: currentBox.value?.x || 0,
  y: currentBox.value?.y || 0,
  z: currentBox.value?.z || 0
});
const boxRotation = reactive<BoxRotation>({
  rotationX: currentBox.value?.rotationX || 0,
  rotationY: currentBox.value?.rotationY || 0,
  rotationZ: currentBox.value?.rotationZ || 0
});

const updateBoxProperties = () => {
  if (currentlySelectedBox instanceof THREE.LineSegments) {
    // 检查是否需要更新
    annotationStore.updateAnnotation(annotationStore.selectedAnnotation,
        boxPosition.x, boxPosition.y, boxPosition.z,
        boxDimensions.width, boxDimensions.height, boxDimensions.depth,
        boxRotation.rotationX, boxRotation.rotationY, boxRotation.rotationZ);

    const newGeometry = new THREE.BoxGeometry(
        boxDimensions.width,
        boxDimensions.height,
        boxDimensions.depth
    );
    const newEdges = new THREE.EdgesGeometry(newGeometry);
    const newBox = new THREE.LineSegments(newEdges, currentlySelectedBox.material);
    newBox.position.set(
        boxPosition.x,
        boxPosition.y,
        boxPosition.z
    );
    // 替换旧对象
    scene.remove(currentlySelectedBox);
    currentlySelectedBox.geometry.dispose(); // 释放旧几何体资源
    currentlySelectedBox = newBox; // 更新为新创建的 LineSegments
    scene.add(currentlySelectedBox);
  }
};

watch([boxDimensions, boxPosition], async () => {
  console.log('Box dimensions or position changed:', boxDimensions, boxPosition);
  if (currentlySelectedBox) {
    console.log("ready to updateBoxProperties");
    updateBoxProperties();
    viewportStore.updateMainCameraState(props.viewerContext.cameras[0], props.viewerContext.controls[0]);
  }
}, {deep: true});
watch(
    () => annotationStore.currentBox,
    (newBox) => {
      if (newBox) {
        boxDimensions.width = newBox.width;
        boxDimensions.height = newBox.height;
        boxDimensions.depth = newBox.depth;
        boxPosition.x = newBox.x;
        boxPosition.y = newBox.y;
        boxPosition.z = newBox.z;
      }
    },
    {deep: true}
);

const ClickBBox = (event: MouseEvent): void => {
  // 计算位置
  const click = useRaycaster(props.viewerContext)
  const intersects = click.calculateIntersects(event)
  // 查找与鼠标点击相交的边界框
  const intersectedBox = intersects.find((intersection) => {
    return intersection.object instanceof THREE.LineSegments
  })
  if (intersectedBox) {
    const {x, y, z} = intersectedBox.object.position
    // 查找与该位置匹配的 annotation
    const annotation = annotationStore.annotations.find((annotation) => {
      const epsilon_x = annotation.width * 0.6
      const epsilon_y = annotation.height * 0.6;
      const epsilon_z = annotation.depth * 0.6
      return (
          Math.abs(annotation.x - x) < epsilon_x &&
          Math.abs(annotation.y - y) < epsilon_y &&
          Math.abs(annotation.z - z) < epsilon_z
      )
    })
    // 更新上一个
    if (currentlySelectedBox instanceof THREE.LineSegments) {
      const material_last = currentlySelectedBox.material;
      if (Array.isArray(material_last)) {
        (material_last[0] as THREE.LineBasicMaterial).color.set(0x00ff00); // 如果材质是数组
      } else {
        (material_last as THREE.LineBasicMaterial).color.set(0x00ff00); // 如果材质不是数组
      }
    }
    // 当前选择
    if (annotation && sceneCamera.type == 0) {
      console.log("selected annotation: ", annotation)
      annotationStore.selectAnnotation(annotation.id);
      annotationStore.currentBox = annotation;
      if (intersectedBox.object instanceof THREE.LineSegments) {
        const material_current = intersectedBox.object.material;
        if (Array.isArray(material_current)) {
          material_current[0].color.set(0xffffff);
        } else {
          material_current.color.set(0xffffff);
        }
      }
      currentlySelectedBox = intersectedBox.object as THREE.LineSegments;
      //切换正交相机
      sceneCamera.set_observe_camera({x: annotation.x, y: annotation.y, z: annotation.z}, boxRotation)
      setTimeout(() => {
        seal_sphere = sceneCamera.createAdjustableCube()
      },50);
      // 打开面板
      showControlPanel.value = true;
      console.log("showControlPanel:", showControlPanel.value, "annotationStore.currentBox", annotationStore.currentBox)
    } else {
      currentlySelectedBox = null
      showControlPanel.value = false;
      annotationStore.selectedAnnotation = null;
      sceneCamera.reset_observe_camera()
      if (seal_sphere && sceneCamera.scene) {
        console.log("should delete sphere")
        sceneCamera.scene.traverse((object) => {
          if (object instanceof THREE.Mesh && !(object.geometry instanceof THREE.BoxGeometry)) {
            sceneCamera.scene?.remove(object);
          }
        });
        seal_sphere = null
        sceneCamera.boxPosition = {x: 0, y: 0, z: 0}
      }
    }
  }
}

const build_BBox = (event: MouseEvent): void => {
  // 计算位置
  const click = useRaycaster(props.viewerContext)
  const intersects = click.calculateIntersects(event)

  if (isBuildBBox()) {
    if (event.button !== 2 || !isKeyAPressed_a.value) {
      return // 如果不是右键点击或字母 'a' 没有被按下，则不执行
    }
    console.log("onMouseClick is running")
    // 创建方块
    const BBox = annotationStore.CreatBBox(intersects, "Car", 2, 1, 2)
    // 将边界框添加到场景中
    scene.add(BBox)
  }
}

// 鼠标拖动相关变量
let initialMousePosition = {x: 0, y: 0};
let initialBoxPosition = {x: 0, y: 0};

const onMouseDown = (event: MouseEvent): void => {
  if (event.button === 0) {
  } else if (event.button === 2) {
    ClickBBox(event)
    build_BBox(event)
  }
  if (!currentlySelectedBox || !isDrag()) return;
  console.log("ready to move, you can drag your mouse")
  annotationStore.isDrawing = true
  // 开始拖动
  initialMousePosition = {x: event.clientX, y: event.clientY};
  // 记录边界框初始位置
  initialBoxPosition = {
    x: boxPosition.x as number,
    y: boxPosition.z as number,
  };
};

const onMouseMove = (event: MouseEvent): void => {
  if (!annotationStore.isDrawing || !currentlySelectedBox) return;
  console.log("move is running")
  // 计算鼠标移动的偏移量
  const deltaX = (event.clientX - initialMousePosition.x) * 0.1; // 调整系数 0.01 可以调节灵敏度
  const deltaY = (event.clientY - initialMousePosition.y) * 0.1;

  // 更新边界框的位置（这里假设拖动只更新 x 和 y 轴，可以根据需要调整为 3D 拖动）
  boxPosition.x = initialBoxPosition.x + deltaX;
  boxPosition.z = initialBoxPosition.y + deltaY; // 鼠标 y 轴方向与 3D 场景 y 轴方向相反
};


const onMouseUp = (): void => {
  // 停止拖动
  annotationStore.isDrawing = false;
};

// 鼠标滑轮事件的处理函数
const onWheel = (event: WheelEvent): void => {
    if (event.deltaY < 0 && seal_sphere) {
      // 向上滚动，缩小
      seal_sphere.scale.set(seal_sphere.scale.x * 0.9091, seal_sphere.scale.y * 0.9091, seal_sphere.scale.z * 0.9091);
      console.log("Shrinking: ", seal_sphere.scale);
    } else if (event.deltaY > 0 && seal_sphere) {
      // 向下滚动，放大
      seal_sphere.scale.set(seal_sphere.scale.x * 1.1, seal_sphere.scale.y * 1.1, seal_sphere.scale.z * 1.1);
      console.log("Enlarging: ", seal_sphere.scale);
    }
  // 阻止默认行为，避免页面滚动
  event.preventDefault();
}

const onKeyDown_a = (event: KeyboardEvent) => {
  if (event.key === 'a') {
    isKeyAPressed_a.value = true
    console.log("isKeyAPressed:", isKeyAPressed_a)
  }
}
// 处理键盘抬起事件，释放字母 'a' 键
const onKeyUp_a = (event: KeyboardEvent) => {
  if (event.key === 'a') {
    isKeyAPressed_a.value = false
    console.log("isKeyAPressed:", isKeyAPressed_a)
  }
}
const onKeyDown_d = (event: KeyboardEvent) => {
  if (event.key === 'd') {
    isKeyAPressed_d.value = true
    console.log("isKeyAPressed:", isKeyAPressed_d)
  }
  if (currentlySelectedBox) {
    if (isDelete() && isKeyAPressed_d) {
      console.log("isDelete")
      currentlySelectedBox.clear()
      props.viewerContext.scene.remove(currentlySelectedBox)  // 从场景中删除选中的边界框
      currentlySelectedBox = null
      showControlPanel.value = false;
      annotationStore.selectedAnnotation = null;
    }
  }
}
const onKeyUp_d = (event: KeyboardEvent) => {
  if (event.key === 'd') {
    isKeyAPressed_d.value = false
    console.log("isKeyAPressed:", isKeyAPressed_d)
  }
}

const isBuildBBox = () => {
  const toolStore = useToolStore()
  const selectedTool = toolStore.currentTool;  // 使用 getter 获取选中的工具
  return (selectedTool && selectedTool.active && selectedTool.id === 'box')
}
const isDelete = () => {
  const toolStore = useToolStore()
  const selectedTool = toolStore.currentTool;  // 使用 getter 获取选中的工具
  return (selectedTool && selectedTool.active && selectedTool.id === 'delete')
}
const isDrag = () => {
  const toolStore = useToolStore()
  const selectedTool = toolStore.currentTool;  // 使用 getter 获取选中的工具
  return (selectedTool && selectedTool.active && selectedTool.id === 'drag')
}

// 组件挂载时监听
onMounted(() => {
  console.log('DrawBB component mounted');
  window.addEventListener('keydown', onKeyDown_a)
  window.addEventListener('keydown', onKeyDown_d)
  window.addEventListener('keyup', onKeyUp_a)
  window.addEventListener('keyup', onKeyUp_d)
  const canvas = props.viewerContext?.renderer.domElement
  if (canvas) {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel)
  }
})

// 组件卸载时监听
onBeforeUnmount(() => {
  window.addEventListener('keydown', onKeyDown_a)
  window.addEventListener('keydown', onKeyDown_d)
  window.addEventListener('keyup', onKeyUp_a)
  window.addEventListener('keyup', onKeyUp_d)
  const canvas = props.viewerContext?.renderer.domElement
  if (canvas) {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('wheel', onWheel)
  }
})

</script>
<template>
  <!-- 控制面板 -->
  <div
      v-if="showControlPanel && annotationStore.currentBox"
      class="control-panel"
      style="position: absolute; top: 10px; left: 10px; z-index: 10;"
  >
    <v-card class="pa-3" elevation="5" style="width: 300px; margin-bottom: 10px;">
      <v-card-title>Adjust Size</v-card-title>
      <v-card-text>
        <!-- 尺寸调整 -->
        <v-slider
            v-model="annotationStore.currentBox.width"
            label="Width"
            min="0.1"
            max="10"
            step="0.1"
        />
        <v-slider
            v-model="annotationStore.currentBox.height"
            label="Height"
            min="0.1"
            max="10"
            step="0.1"
        />
        <v-slider
            v-model="annotationStore.currentBox.depth"
            label="Depth"
            min="0.1"
            max="10"
            step="0.1"
        />
        <v-text-field
            v-model="annotationStore.currentBox.width"
            label="Width"
            step="0.1"
            type="number"
        />
        <v-text-field
            v-model="annotationStore.currentBox.height"
            label="Height"
            step="0.1"
            type="number"
        />
        <v-text-field
            v-model="annotationStore.currentBox.depth"
            label="Depth"
            step="0.1"
            type="number"
        />
      </v-card-text>
    </v-card>
    <v-card class="pa-3" elevation="5" style="width: 300px;">
      <v-card-title>Adjust Position</v-card-title>
      <v-card-text>
        <!-- 位置调整 -->
        <v-slider
            v-model="annotationStore.currentBox.x"
            label="X Position"
            min="-10"
            max="10"
            step="0.1"
        />
        <v-slider
            v-model="annotationStore.currentBox.y"
            label="Y Position"
            min="-10"
            max="10"
            step="0.1"
        />
        <v-slider
            v-model="annotationStore.currentBox.z"
            label="Z Position"
            min="-10"
            max="10"
            step="0.1"
        />
        <v-text-field
            v-model="annotationStore.currentBox.x"
            label="X Position"
            step="0.1"
            type="number"
        />
        <v-text-field
            v-model="annotationStore.currentBox.y"
            label="Y Position"
            step="0.1"
            type="number"
        />
        <v-text-field
            v-model="annotationStore.currentBox.z"
            label="Z Position"
            step="0.1"
            type="number"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.control-panel {
  cursor: move;
}
</style>