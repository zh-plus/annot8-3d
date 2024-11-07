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
        onInit,
        onAnimate,
        onResize,
        onUnmount,
        constraints,
        controlsConfig
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
        Object.assign(viewerContext.controls, CONTROLS, controlsConfig || {})

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
        viewerContext.renderer.render(viewerContext.scene, viewerContext.camera)
    }

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
