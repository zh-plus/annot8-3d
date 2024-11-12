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
        controls.minAzimuthAngle = finalConstraints.minAzimuthAngle
    }
    if (finalConstraints.maxAzimuthAngle !== undefined) {
        controls.maxAzimuthAngle = finalConstraints.maxAzimuthAngle
    }
    if (finalConstraints.minPolarAngle !== undefined) {
        controls.minPolarAngle = finalConstraints.minPolarAngle
    }
    if (finalConstraints.maxPolarAngle !== undefined) {
        controls.maxPolarAngle = finalConstraints.maxPolarAngle
    }
    if (finalConstraints.minDistance !== undefined) {
        controls.minDistance = finalConstraints.minDistance
    }
    if (finalConstraints.maxDistance !== undefined) {
        controls.maxDistance = finalConstraints.maxDistance
    }

    // Register controls
    viewportStore.registerViewerControls(viewerId, controls)

    // Setup control change handlers
    controls.addEventListener('change', () => {
        if (viewerId === VIEWER_MODES.MAIN) {
            viewportStore.updateMainCameraState(camera, controls)
        }
    })

    // Cleanup function
    return () => {
        viewportStore.unregisterViewerControls(viewerId)
    }
}