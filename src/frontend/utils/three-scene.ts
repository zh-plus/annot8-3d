import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import type {CameraPosition, ViewerContext} from '@/types'
import {CONTROLS, THREE_SCENE_COLORS, VIEWER_CONSTRAINTS, VIEWER_DEFAULTS} from '@/constants'
import {useSceneCamera} from '@/stores/scene_camera_control'
import {OrthographicCamera} from "three";

export function initializeScene(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    cameraPosition: CameraPosition,
    viewerId: string
    // main
): ViewerContext {
    const sceneCamera = useSceneCamera()
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    //camera_ort.lookAt(new THREE.Vector3(boxPosition.x, boxPosition.y, boxPosition.z));
    if (viewerId === 'main') {
        console.log("ini scene")
        //返回的camera都是透视相机
        const camera = sceneCamera.ini_camera(container, cameraPosition)
        const controls = new OrbitControls(camera, canvas)
        Object.assign(controls, CONTROLS, VIEWER_CONSTRAINTS)
        const scene = sceneCamera.ini_scene()
        const gridHelper = new THREE.GridHelper(10, 10, THREE_SCENE_COLORS.grid, THREE_SCENE_COLORS.grid)
        scene.add(gridHelper)
        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)
        return {
            scene: scene,
            cameras: [camera],
            renderer: renderer,
            controls: [controls]
        }
    } else {
        if (!sceneCamera.camera) {
            console.log("errors in ini scene")
            const camera = sceneCamera.ini_camera(container, cameraPosition)
            const controls = new OrbitControls(camera, canvas)
            return {
                scene: sceneCamera.ini_scene(),
                cameras: [camera],
                renderer: renderer,
                controls: [controls]
            }
        }
        console.log("ini scene successfully")
        const {camera_per, camera_ort} = createCamera(viewerId, sceneCamera.camera, container)
        const control_per = new OrbitControls(camera_per, canvas)
        Object.assign(control_per, CONTROLS, VIEWER_CONSTRAINTS)
        const control_ort = new OrbitControls(camera_ort as OrthographicCamera, canvas)
        Object.assign(control_ort, CONTROLS, VIEWER_CONSTRAINTS)
        return {
            scene: sceneCamera.scene as THREE.Scene,
            cameras: [camera_per, camera_ort as OrthographicCamera],
            renderer: renderer,
            controls: [control_per, control_ort]
        }
    }
}

function createCamera(type: string, baseCamera: THREE.PerspectiveCamera, container: HTMLElement) {
    const sceneCamera = useSceneCamera()
    const cameraDirection = new THREE.Vector3();
    baseCamera.getWorldDirection(cameraDirection); // 获取视线方向
    // const cameraDirectionSide = new THREE.Vector3();
    // cameraDirectionSide.cross(new THREE.Vector3(0, 1, 0)).normalize(); // 计算右侧方向（垂直于视线）
    const rightDirection = new THREE.Vector3().crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();
    const camera_ort = sceneCamera.ini_camera_ort(container, baseCamera, type)
    let camera_per;
    switch (type) {
        case "side":
            camera_per = sceneCamera.ini_camera_side_per(container, baseCamera, cameraDirection, rightDirection)
            return {camera_per, camera_ort}
        case "overhead":
            camera_per = sceneCamera.ini_camera_head_per(container, baseCamera, cameraDirection, rightDirection)
            return {camera_per, camera_ort}
        case "front":
            camera_per = sceneCamera.ini_camera_front_per(container, baseCamera, cameraDirection, rightDirection)
            return {camera_per, camera_ort}
        default:
            console.log("errors in ini camera")
            camera_per = sceneCamera.ini_camera_front_per(container, baseCamera, cameraDirection, rightDirection)
            return {camera_per, camera_ort}
    }
}

export function cleanupViewer(context: ViewerContext) {
    // Dispose controls
    if (context.controls) {
        context.controls[0].dispose()
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