import type {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {CameraPosition} from "@/types/controls.ts";

export interface ViewerContext {
    scene: Scene
    camera: PerspectiveCamera
    renderer: WebGLRenderer
    controls: OrbitControls
}

export interface BaseViewerProps {
    label: string
    cameraPosition: CameraPosition
    enableGrid?: boolean
    enableAxes?: boolean
    backgroundColor?: number
}

export interface MainViewerProps extends Omit<BaseViewerProps, 'label' | 'cameraPosition'> {
    // Main-viewer specific props
}

export interface AuxiliaryViewerProps {
    label: string
    cameraPosition: CameraPosition
}

export type ViewerId = 'main' | 'overhead' | 'side' | 'rear'