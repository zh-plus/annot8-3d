export const VIEWER_DIMENSIONS = {
    minWidth: 320,
    minHeight: 240,
    aspectRatio: 16 / 9
} as const

export const VIEWER_CONSTRAINTS = {
    minDistance: 1,
    maxDistance: 100,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity
} as const

export const VIEWER_DEFAULTS = {
    pointSize: 0.05,
    pointBudget: 1_000,
    lodLevel: 1,
    fov: 75,
    near: 0.1,
    far: 1000
} as const

// Add viewer modes for better type safety
export const VIEWER_MODES = {
    MAIN: 'main',
    OVERHEAD: 'overhead',
    SIDE: 'side',
    REAR: 'rear'
} as const