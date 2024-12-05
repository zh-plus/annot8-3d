import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import type {CameraPosition, ViewerContext} from '@/types'
import {CONTROLS, THREE_SCENE_COLORS, VIEWER_CONSTRAINTS, VIEWER_DEFAULTS} from '@/constants'
import type {PerspectiveCamera} from "three";


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
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection); // 获取相机的视线方向

    const offset = 5
    const camera_side = createCamera("side", camera, offset,container) as THREE.PerspectiveCamera;
    const camera_head = createCamera("head", camera, offset,container) as THREE.PerspectiveCamera;
    const camera_rear = createCamera("rear", camera, offset,container) as THREE.PerspectiveCamera;


    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const controls = new OrbitControls(camera, canvas)
    Object.assign(controls, CONTROLS, VIEWER_CONSTRAINTS)

    const controls_side = new OrbitControls(camera_side, canvas);
    //Object.assign(controls_side, CONTROLS, VIEWER_CONSTRAINTS)
    const controls_head = new OrbitControls(camera_head, canvas);
    //Object.assign(controls_side, CONTROLS, VIEWER_CONSTRAINTS)
    const controls_rear = new OrbitControls(camera_rear, canvas);
    //Object.assign(controls_side, CONTROLS, VIEWER_CONSTRAINTS)

    const gridHelper = new THREE.GridHelper(100, 100, THREE_SCENE_COLORS.grid, THREE_SCENE_COLORS.grid)

    scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    return {scene, camera, camera_side, camera_head, camera_rear, renderer, controls, controls_side, controls_head, controls_rear}
}

function createCamera(type:string, baseCamera:PerspectiveCamera, offset:number, container:HTMLElement) {
    const camera = new THREE.PerspectiveCamera(
        VIEWER_DEFAULTS.fov,
        container.clientWidth / container.clientHeight,
        VIEWER_DEFAULTS.near,
        VIEWER_DEFAULTS.far
    );

    const cameraDirection = new THREE.Vector3();
    baseCamera.getWorldDirection(cameraDirection); // 获取视线方向

    const cameraDirectionSide = new THREE.Vector3();
    cameraDirectionSide.cross(new THREE.Vector3(0, 1, 0)).normalize(); // 计算右侧方向（垂直于视线）

    switch (type) {
        case "side":
            // 侧面视角
            camera.position.set(
                baseCamera.position.x + 3 + offset * (cameraDirectionSide.x + cameraDirection.x),
                baseCamera.position.y,
                baseCamera.position.z + 3 + offset * (cameraDirectionSide.z + cameraDirection.z)
            );
            break;

        case "head":
            // 顶视角
            camera.position.set(
                baseCamera.position.x,
                baseCamera.position.y + 3,
                baseCamera.position.z
            );
            camera.up.set(0, 0, -1); // 设置相机的 "上" 方向
            break;

        case "rear":
            // 后视角
            camera.position.set(
                -(baseCamera.position.x + 3 + offset * (cameraDirectionSide.x + cameraDirection.x)),
                baseCamera.position.y,
                -(baseCamera.position.z + 3 + offset * (cameraDirectionSide.z + cameraDirection.z))
            );
            break;

        default:
            console.warn("Invalid camera type:", type);
            return null;
    }

    // 设置相机看向基准相机的位置
    camera.lookAt(baseCamera.position.x, baseCamera.position.y, baseCamera.position.z);
    return camera;
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