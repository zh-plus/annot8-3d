import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import type {CameraPosition, ViewerContext} from '@/types'
import {CONTROLS, THREE_SCENE_COLORS, VIEWER_CONSTRAINTS, VIEWER_DEFAULTS} from '@/constants'

export function initializeScene(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    cameraPosition: CameraPosition
): ViewerContext {

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(THREE_SCENE_COLORS.background)

    const camera = new THREE.PerspectiveCamera(
        VIEWER_DEFAULTS.fov,
        container.clientWidth / container.clientHeight,
        VIEWER_DEFAULTS.near,
        VIEWER_DEFAULTS.far
    )
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const controls = new OrbitControls(camera, canvas)
    Object.assign(controls, CONTROLS, VIEWER_CONSTRAINTS)

    const gridHelper = new THREE.GridHelper(500, 500, THREE_SCENE_COLORS.grid, THREE_SCENE_COLORS.grid)
    scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    return {scene, camera, renderer, controls}
}

export function cleanupViewer(context: ViewerContext) {
    // Dispose controls
    if (context.controls) {
        context.controls.dispose()
    }

    // Dispose materials and geometries from the scene
    context.scene.traverse((object) => {
        if (object instanceof THREE.Points) {
            if (object.geometry) {
                object.geometry.dispose()
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose())
                } else {
                    object.material.dispose()
                }
            }
        }
    })

    // Clear scene
    context.scene.clear()

    // Dispose renderer
    if (context.renderer) {
        context.renderer.dispose()
        context.renderer.forceContextLoss()
    }
}