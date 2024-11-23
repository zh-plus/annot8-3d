import {onBeforeUnmount, onMounted, Ref} from 'vue'
import * as THREE from 'three'
import {cleanupViewer, initializeScene} from '@/utils/three-scene'
import {useViewportStore} from '@/stores'
import {setupViewerSync} from '@/utils/camera-sync'
import {CONTROLS, VIEWER_CONSTRAINTS, VIEWER_DIMENSIONS} from '@/constants'
import type {ViewerContext} from '@/types'

interface UseViewerOptions {
    viewerId: string
    containerRef: Ref<HTMLDivElement | null>
    canvasRef: Ref<HTMLCanvasElement | null>
    cameraPosition: THREE.Vector3 | { x: number; y: number; z: number }
    onInit?: (viewerContext: ViewerContext) => void
    onAnimate?: (viewerContext: ViewerContext) => void
    onResize?: (viewerContext: ViewerContext) => void
    onUnmount?: (viewerContext: ViewerContext) => void
    constraints?: {
        minDistance?: number
        maxDistance?: number
    }
    controlsConfig?: Partial<typeof CONTROLS>
}

export function useViewer(options: UseViewerOptions) {
    const {
        viewerId,
        containerRef,
        canvasRef,
        cameraPosition,
        onInit, //onInit：初始化时调用的回调。
        onAnimate, //onAnimate：每帧更新时调用的回调。
        onResize,
        onUnmount,//onUnmount：组件卸载时调用的回调。
        constraints,
        controlsConfig //controlsConfig：用于设置控制器（如相机控制）。
    } = options

    const viewportStore = useViewportStore()
    let viewerContext: ViewerContext
    let animationFrameId: number
    let cleanupSync: (() => void) | undefined

    const init = () => {
        if (!containerRef.value || !canvasRef.value) return

        viewerContext = initializeScene(
            canvasRef.value,
            containerRef.value,
            cameraPosition
        )

        // Apply control settings
        // 这行代码用于应用默认控制器配置并结合 controlsConfig（如果有的话）进行调整。
        Object.assign(viewerContext.controls, CONTROLS, controlsConfig || {})
        // 控制器（controls）用于操作场景视角的交互（如鼠标拖动进行旋转等）
        viewerContext.controls.minDistance = constraints?.minDistance || VIEWER_CONSTRAINTS.minDistance
        viewerContext.controls.maxDistance = constraints?.maxDistance || VIEWER_CONSTRAINTS.maxDistance

        // Register controls with the store
        viewportStore.registerViewerControls(viewerId, viewerContext.controls)

        // Setup camera synchronization
        cleanupSync = setupViewerSync({
            viewerId,
            controls: viewerContext.controls,
            camera: viewerContext.camera,
            constraints: {
                minDistance: viewerContext.controls.minDistance,
                maxDistance: viewerContext.controls.maxDistance
            }
        })

        // Custom initialization logic
        onInit?.(viewerContext)

        animate()
    }

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate)

        // Update controls
        viewerContext.controls.update()

        // Custom per-frame logic
        onAnimate?.(viewerContext)

        // Render the scene
        // 每一帧都会更新控制器，并渲染场景
        viewerContext.renderer.render(viewerContext.scene, viewerContext.camera)
    }
    // 窗口大小变化时重新计算视口，并调整相机的纵横比以及渲染器的尺寸。
    const handleResize = () => {
        if (!containerRef.value || !viewerContext) return

        const {clientWidth, clientHeight} = containerRef.value
        const width = Math.max(clientWidth, VIEWER_DIMENSIONS.minWidth)
        const height = Math.max(clientHeight, VIEWER_DIMENSIONS.minHeight)

        viewerContext.camera.aspect = width / height
        viewerContext.camera.updateProjectionMatrix()
        viewerContext.renderer.setSize(width, height)

        // Custom resize logic
        onResize?.(viewerContext)
    }

    onMounted(() => {
        init()
        window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
        viewportStore.unregisterViewerControls(viewerId)
        cleanupSync?.()
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationFrameId)
        cleanupViewer(viewerContext)
        onUnmount?.(viewerContext)
    })
    return {viewerContext: viewerContext!}
}