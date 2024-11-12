<script setup lang="ts">
import * as THREE from "three";
import {useRaycaster} from "@/composables/useViewerContext.ts";
import {computed, PropType, reactive, Ref, ref, watch} from "vue";
import type {ViewerContext} from "@/types";
import {useAnnotationStore, useToolStore} from "@/stores";
import {onMounted, onBeforeUnmount} from 'vue'
import {VDialog, VCard, VTextField, VSlider} from 'vuetify/components';

const props = defineProps({
  viewerContext: {
    type: Object as PropType<ViewerContext>,
    required: true
  }
})

const annotationStore = useAnnotationStore()
let currentlySelectedBox: THREE.LineSegments | null = null;
const currentBox = computed(() => annotationStore.currentBox);
const scene = props.viewerContext.scene

const isKeyAPressed_a = ref(false)
const isKeyAPressed_d = ref(false)

const showControlPanel = ref(false);

const boxDimensions = reactive({
  width: currentBox.value?.width || 1,
  height: currentBox.value?.height || 1,
  depth: currentBox.value?.depth || 1
});
const boxPosition = reactive({
  x: currentBox.value?.x || 0,
  y: currentBox.value?.y || 0,
  z: currentBox.value?.z || 0
});

const updateBoxProperties = () => {
  if (currentlySelectedBox instanceof THREE.LineSegments) {
    // 检查是否需要更新
    console.log("updateBoxProperties is running")
    const newGeometry = new THREE.BoxGeometry(
        boxDimensions.width,
        boxDimensions.height,
        boxDimensions.depth
    );
    const newEdges = new THREE.EdgesGeometry(newGeometry);
    // 创建新的 LineSegments 对象
    const newBox = new THREE.LineSegments(newEdges, currentlySelectedBox.material);
    // 更新位置
    newBox.position.set(
        boxPosition.x,
        boxPosition.y,
        boxPosition.z
    );
    // 替换旧对象
    scene.remove(currentlySelectedBox);
    scene.add(newBox);
    currentlySelectedBox.geometry.dispose(); // 释放旧几何体资源
    currentlySelectedBox = newBox; // 更新为新创建的 LineSegments
    // requestAnimationFrame(() => {
    //   props.viewerContext.renderer.render(props.viewerContext.scene, props.viewerContext.camera);
    // });
  }
};

watch([boxDimensions, boxPosition, currentBox], async () => {
  if (currentlySelectedBox) {
    console.log("ready to updateBoxProperties");
    updateBoxProperties();
  }
});

const onMouseClick = (event: MouseEvent): void => {
  // 计算位置
  const intersect = useRaycaster(props.viewerContext)
  const intersects = intersect.calculateIntersects(event)
  // 查找与鼠标点击相交的边界框
  const intersectedBox = intersects.find((intersection) => {
    return intersection.object instanceof THREE.LineSegments
  })
  if (intersectedBox) {
    const {x, y} = intersectedBox.object.position
    // 查找与该位置匹配的 annotation
    const annotation = annotationStore.annotations.find((annotation) => {
      const epsilon_x = annotation.width * 0.6
      const epsilon_y = annotation.depth * 0.6;
      return (
          Math.abs(annotation.x - x) < epsilon_x &&
          Math.abs(annotation.y - y) < epsilon_y
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
    if (annotation) {
      console.log("selected annotation: ", annotation)
      annotationStore.selectAnnotation(annotation.id);
      if (intersectedBox.object instanceof THREE.LineSegments) {
        const material_current = intersectedBox.object.material;
        if (Array.isArray(material_current)) {
          material_current[0].color.set(0xffffff);
        } else {
          material_current.color.set(0xffffff);
        }
      }
      currentlySelectedBox = intersectedBox.object as THREE.LineSegments;
      // 打开面板
      if (annotation) {
        annotationStore.currentBox = annotation;
        // 将当前边界框的尺寸和位置加载到控制面板中
        boxDimensions.width = annotation.width;
        boxDimensions.height = annotation.height;
        boxDimensions.depth = annotation.depth;
        boxPosition.x = annotation.x;
        boxPosition.y = annotation.y;
        boxPosition.z = annotation.z;
        showControlPanel.value = true; // 显示控制面板
      }
      console.log("showControlPanel:", showControlPanel.value, "annotationStore.currentBox", annotationStore.currentBox)
    }
  } else {
    annotationStore.annotations.forEach(annotation => {
      annotationStore.selectedAnnotation = null;
    });
  }
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

const onKeyDown_a = (event: KeyboardEvent) => {
  if (event.key === 'a') {
    isKeyAPressed_a.value = true
    console.log("isKeyAPressed:", isKeyAPressed_a)
  }
  console.log("boxDimensions:", boxDimensions)
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
      currentlySelectedBox = null;
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

// 组件挂载时监听
onMounted(() => {
  console.log('DrawBB component mounted');
  window.addEventListener('keydown', onKeyDown_a)
  window.addEventListener('keydown', onKeyDown_d)
  window.addEventListener('keyup', onKeyUp_a)
  window.addEventListener('keyup', onKeyUp_d)
  const canvas = props.viewerContext?.renderer.domElement
  if (canvas) {
    canvas.addEventListener('contextmenu', (event) => {
      onMouseClick(event)
    })
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
    canvas.removeEventListener('contextmenu', (event) => {
      event.preventDefault()
      onMouseClick(event)
    })
  }
})

</script>
<template>
  <!-- 控制面板 -->
  <div
      v-if="showControlPanel && currentBox"
      class="control-panel"
      style="position: absolute; top: 10px; left: 10px; z-index: 10;"
  >
    <v-card class="pa-3" elevation="5" style="width: 300px;">
      <v-card-title>Adjust Bounding Box</v-card-title>
      <v-card-text>
        <v-slider v-model="currentBox.width" label="Width" min="0.1" max="10" step="0.1"/>
        <v-slider v-model="currentBox.height" label="Height" min="0.1" max="10" step="0.1"/>
        <v-slider v-model="currentBox.depth" label="Depth" min="0.1" max="10" step="0.1"/>
        <v-text-field v-model="currentBox.x" label="X Position" type="number"/>
        <v-text-field v-model="currentBox.y" label="Y Position" type="number"/>
        <v-text-field v-model="currentBox.z" label="Z Position" type="number"/>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showControlPanel = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.control-panel {
  cursor: move;
  /* 可以增加一些动画效果，增加交互体验 */
}
</style>