import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {OrthographicCamera, PerspectiveCamera} from "three";

export interface CameraPosition {
    x: number
    y: number
    z: number
}

export interface ViewerConstraints {
    minAzimuthAngle?: number
    maxAzimuthAngle?: number
    minPolarAngle?: number
    maxPolarAngle?: number
    minDistance?: number
    maxDistance?: number
}

export interface ViewerSyncConfig {
    viewerId: string
    controls: OrbitControls[]
    camera: PerspectiveCamera | OrthographicCamera
    constraints?: ViewerConstraints
}
