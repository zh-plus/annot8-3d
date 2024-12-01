import {defineStore} from 'pinia'
import type {SceneState} from './types'
import {VIEWER_DEFAULTS} from '@/constants'
import {PointCloudMetadata} from '@/types'

export const useSceneStore = defineStore('scene', {
    state: (): SceneState => ({
        isLoading: false,
        pointCloudMetadata: null,
        activeChunks: new Map(),
        lodLevel: VIEWER_DEFAULTS.lodLevel,
        pointSize: VIEWER_DEFAULTS.pointSize,
        pointBudget: VIEWER_DEFAULTS.pointBudget
    }),

    actions: {
        setLoading(loading: boolean) {
            this.isLoading = loading
        },

        setPointCloudMetadata(metadata: PointCloudMetadata) {
            this.pointCloudMetadata = metadata
        },

        updatePointSize(size: number) {
            this.pointSize = Math.max(0.1, Math.min(size, 5))
        },

        updateLODLevel(level: number) {
            this.lodLevel = Math.max(1, Math.min(level, 8))
        },

        clearScene() {
            this.activeChunks.clear()
            this.pointCloudMetadata = null
        }
    }
})