// stores/viewerStore.ts
import { defineStore } from 'pinia';
import {ViewerContext} from "@/types";
import {ref} from "vue";
export const useViewerStore = defineStore('viewer', {
  state: () => ({
    viewerContext_main: ref<ViewerContext | null>(null),
    viewerContext_aux: ref<ViewerContext | null>(null),
  }),
  actions: {
    viewerContextMain(context: ViewerContext) {
      this.viewerContext_main = context;
    },
    viewerContextAux(context: ViewerContext) {
      this.viewerContext_aux = context;
    },
  },
});