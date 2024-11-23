export const CONTROLS = {
    dampingFactor: 0.05,
    enableDamping: true,
    screenSpacePanning: false,
    enableRotate: true,
    enableZoom: true,
    enablePan: true,
    rotateSpeed: 1.0,
    zoomSpeed: 1.0,
    panSpeed: 1.0
} as const

// Add control modes for better type checking
export const CONTROL_MODES = {
    ORBIT: 'orbit',
    PAN: 'pan',
    ZOOM: 'zoom'
} as const