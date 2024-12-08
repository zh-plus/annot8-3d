import type {ViewerSyncConfig} from '@/types'
import {useViewportStore} from "@/stores";
import {VIEWER_CONSTRAINTS, VIEWER_MODES} from '@/constants'

export function setupViewerSync(config: ViewerSyncConfig) {
    const {viewerId, controls, camera, constraints = {}} = config
    const viewportStore = useViewportStore()

    // Apply default constraints with custom overrides
    const finalConstraints = {
        ...VIEWER_CONSTRAINTS,
        ...constraints
    }

    // Explicitly set each constraint property
    if (finalConstraints.minAzimuthAngle !== undefined) {
        for (let i = 0; i < controls.length; i++) {
            controls[i].minAzimuthAngle = finalConstraints.minAzimuthAngle
        }
    }
    if (finalConstraints.maxAzimuthAngle !== undefined) {
        for (let i = 0; i < controls.length; i++){
            controls[i].maxAzimuthAngle = finalConstraints.maxAzimuthAngle
        }
    }
    if (finalConstraints.minPolarAngle !== undefined) {
        for (let i = 0; i < controls.length; i++){
            controls[i].minPolarAngle = finalConstraints.minPolarAngle
        }
    }
    if (finalConstraints.maxPolarAngle !== undefined) {
        for (let i = 0; i < controls.length; i++){
            controls[i].maxPolarAngle = finalConstraints.maxPolarAngle
        }
    }
    if (finalConstraints.minDistance !== undefined) {
        for (let i = 0; i < controls.length; i++){
            controls[i].minDistance = finalConstraints.minDistance
        }
    }
    if (finalConstraints.maxDistance !== undefined) {
        for (let i = 0; i < controls.length; i++){
            controls[i].maxDistance = finalConstraints.maxDistance
        }
    }

    // Register controls
    viewportStore.registerViewerControls(viewerId, controls)

    // Setup control change handlers
    controls[0].addEventListener('change', () => {
        if (viewerId === VIEWER_MODES.MAIN) {
            viewportStore.updateMainCameraState(camera, controls[0])
        }
    })

    // Cleanup function
    return () => {
        viewportStore.unregisterViewerControls(viewerId)
    }
}