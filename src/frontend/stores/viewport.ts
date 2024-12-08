import {defineStore} from 'pinia'
import {OrthographicCamera, type PerspectiveCamera, Vector3} from 'three'
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {CAMERA_POSITIONS, VIEWER_MODES} from '@/constants'
import type {ViewportState} from './types'
import {useSceneCamera} from '@/stores/scene_camera_control'

export const useViewportStore = defineStore('viewport', {
    state: (): ViewportState => ({
        activeView: 'main',
        cameraPositions: {
            main: CAMERA_POSITIONS.main,
            overhead: CAMERA_POSITIONS.overhead,
            side: CAMERA_POSITIONS.side,
            front: CAMERA_POSITIONS.front
        },
        syncEnabled: true,
        mainCameraState: {
            position: new Vector3(0, 0, 5),
            target: new Vector3(0, 0, 0),
        },
        viewerControls: new Map<string, OrbitControls[]>()
    }),

    actions: {
        registerViewerControls(viewerId: string, controls: OrbitControls[]) {
            if (viewerId == "overhead") {
                controls[0].minPolarAngle = Math.PI / 2; // 最小俯仰角（45度)
                controls[0].maxPolarAngle = Math.PI / 2; // 最大俯仰角（90度，正下方）
                controls[0].minAzimuthAngle = 0; // 最小水平旋转角度（-45度）
                controls[0].maxAzimuthAngle = 0; // 最大水平旋转角度（45度）
            }
            this.viewerControls.set(viewerId, controls)
        },

        unregisterViewerControls(viewerId: string) {
            this.viewerControls.delete(viewerId)
        },

        updateMainCameraState(camera: PerspectiveCamera | OrthographicCamera, controls: OrbitControls) {
            const sceneCamera = useSceneCamera()
            if(sceneCamera.type == 1){
                controls.target.set(sceneCamera.boxPosition.x, sceneCamera.boxPosition.y, sceneCamera.boxPosition.z)
            }
            //sceneCamera.distance = controls[0].distance
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
                const mainTarget = this.mainCameraState.target.clone()
                const viewerPosition = CAMERA_POSITIONS[viewerId]

                if (!viewerPosition) return

                const sceneCamera = useSceneCamera()

                switch (viewerId) {
                    case VIEWER_MODES.OVERHEAD:

                        sceneCamera.update_camera_head(controls, mainPosition, mainTarget)
                        break

                    case VIEWER_MODES.SIDE:

                        sceneCamera.update_camera_side(controls, mainPosition, mainTarget)
                        break

                    case VIEWER_MODES.FRONT:

                        sceneCamera.update_camera_front(controls, mainPosition, mainTarget)
                        break
                }
                //controls.update()
            })
        },

        toggleSync() {
            this.syncEnabled = !this.syncEnabled
        }
    }
})