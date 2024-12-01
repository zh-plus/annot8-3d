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

        const normalizedX = (event.clientX - rect.left) / rect.width
        const normalizedY = (event.clientY - rect.top) / rect.height

        const viewportX = normalizedX / (window.innerWidth * 0.73 / rect.width) * 2 - 1
        const viewportY = -normalizedY * 2 + 1

        mouse.x = viewportX
        mouse.y = viewportY

        raycaster.setFromCamera(mouse, camera)

        return raycaster.intersectObjects(viewerContext?.scene.children) || []
    }
    return {
        calculateIntersects
    }
}