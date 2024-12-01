import type {CameraPosition} from '@/types'

export const DEFAULT_FOV = 75
export const DEFAULT_NEAR = 0.1
export const DEFAULT_FAR = 1000

export const CAMERA_POSITIONS: Record<string, CameraPosition> = {
    main: {x: 0, y: 0, z: 5},
    overhead: {x: 0, y: 5, z: 0},
    side: {x: 5, y: 0, z: 0},
    rear: {x: 0, y: 0, z: -5}
} as const

export const CAMERA_SETTINGS = {
    defaultUp: {x: 0, y: 1, z: 0},
    lookAt: {x: 0, y: 0, z: 0}
} as const