import { defineStore } from 'pinia'
import * as THREE from 'three'

export const useMainSceneStore = defineStore('scene', {
    state: () => ({
        scene: null as THREE.Scene | null
    }),
    actions: {
        setScene(newScene: THREE.Scene) {
            this.scene = newScene
        },
        clearScene() {
            if (this.scene) {
                this.scene.children.forEach(child => {
                    this.scene?.remove(child)
                })
            }
            this.scene = null
        }
    }
})
