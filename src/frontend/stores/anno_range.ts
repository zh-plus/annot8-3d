import { defineStore } from 'pinia';
import {useAnnotationStore} from "./annotation.ts";

export const useAnnoRange = defineStore('annoRange', {
  state: () => ({
    range: [-5, 5],
    max: 10,
    min: 10
  }),
  actions: {
    updateLeft(value: number) {  // 显式指定 value 为 number 类型
      console.log("updateLeft value in anno_range:", value)
      const annotationStore = useAnnotationStore()
      if (annotationStore.currentBox) {
        annotationStore.currentBox.yx_left = value;  // 更新 annotationStore 的 currentBox.yx_left
      }
    },
    updateRight(value: number) {  // 显式指定 value 为 number 类型
      const annotationStore = useAnnotationStore()
      console.log("updateRight value in anno_range:", value)
      if (annotationStore.currentBox) {
        annotationStore.currentBox.yx_right = value;  // 更新 annotationStore 的 currentBox.yx_right
      }
    }
  }
});