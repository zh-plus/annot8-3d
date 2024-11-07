import {defineStore} from 'pinia'
import {type PerspectiveCamera, Vector3} from 'three'
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {CAMERA_POSITIONS, VIEWER_MODES} from '@/constants'
import type {ViewportState} from './types'

export const useViewportStore = defineStore('viewport', {
    state: (): ViewportState => ({
        activeView: 'main',
        cameraPositions: {
            main: CAMERA_POSITIONS.main,
            overhead: CAMERA_POSITIONS.overhead,
            side: CAMERA_POSITIONS.side,
            rear: CAMERA_POSITIONS.rear
        },
        syncEnabled: true,
        mainCameraState: {
            position: new Vector3(0, 0, 5),
            target: new Vector3(0, 0, 0),
        },
        viewerControls: new Map()
    }),

    actions: {
        registerViewerControls(viewerId: string, controls: OrbitControls) {
            this.viewerControls.set(viewerId, controls)
        },

        unregisterViewerControls(viewerId: string) {
            this.viewerControls.delete(viewerId)
        },

        updateMainCameraState(camera: PerspectiveCamera, controls: OrbitControls) {
            this.mainCameraState = {
                position: camera.position.clone(),
                target: controls.target.clone(),
            }

            if (this.syncEnabled) {
                this.synchronizeViews()
            }
        },

        synchronizeViews() {
            this.viewerControls.forEach((controls, viewerId) => {
                if (viewerId === VIEWER_MODES.MAIN) return

                const mainPosition = this.mainCameraState.position.clone()
                const viewerPosition = CAMERA_POSITIONS[viewerId]

                if (!viewerPosition) return

                switch (viewerId) {
                    case VIEWER_MODES.OVERHEAD:
                        // Maintain Y position, sync X and Z
                        controls.object.position.set(
                            mainPosition.x,
                            5, // Fixed height for overhead view
                            mainPosition.z
                        )
                        // Keep looking straight down
                        controls.target.set(
                            mainPosition.x,
                            0,
                            mainPosition.z
                        )
                        break

                    case VIEWER_MODES.SIDE:
                        // Maintain X position, sync Y and Z
                        controls.object.position.set(
                            5, // Fixed position for side view
                            mainPosition.y,
                            mainPosition.z
                        )
                        // Keep looking along X axis
                        controls.target.set(
                            0,
                            mainPosition.y,
                            mainPosition.z
                        )
                        break

                    case VIEWER_MODES.REAR:
                        // Maintain Z position, sync X and Y
                        controls.object.position.set(
                            mainPosition.x,
                            mainPosition.y,
                            -5 // Fixed position for rear view
                        )
                        // Keep looking along Z axis
                        controls.target.set(
                            mainPosition.x,
                            mainPosition.y,
                            0
                        )
                        break
                }

                controls.update()
            })
        },

        toggleSync() {
            this.syncEnabled = !this.syncEnabled
        }
    }
})