// src/composables/useRaycaster.ts
import * as THREE from 'three'
import {ref} from 'vue'

export const useRaycaster = (viewerContext: any) => {
    const mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    const canvas = viewerContext?.renderer.domElement
    const camera = viewerContext?.camera
    const calculateIntersects = (event: MouseEvent) => {
        if (!canvas || !camera) return []

        const rect = canvas.getBoundingClientRect()
        mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
        mouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        return raycaster.intersectObjects(viewerContext?.scene.children) || []
    }
    return {
        calculateIntersects
    }
}