import type {Annotation, Label, PointCloudChunk, PointCloudMetadata, Tool} from '@/types'
import type {Vector3} from 'three'
import type {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

export interface CameraState {
    position: Vector3
    target: Vector3
}

export interface ViewportState {
    activeView: 'main' | 'overhead' | 'side' | 'rear'
    cameraPositions: Record<string, { x: number; y: number; z: number }>
    syncEnabled: boolean
    mainCameraState: CameraState
    viewerControls: Map<string, OrbitControls>
}

export interface LabelState {
    labels: Label[]
    selectedLabels: Label[]
}

export interface ToolState {
    selectedTool: string | null
    tools: Tool[]
}

export interface SceneState {
    isLoading: boolean
    pointCloudMetadata: PointCloudMetadata | null
    activeChunks: Map<string, PointCloudChunk>
    lodLevel: number
    pointSize: number
    pointBudget: number
}

export interface AnnotationState {
    annotations: Annotation[]
    selectedAnnotation: string | null
    isDrawing: boolean
    //add new
    currentBox: { x: number, y: number, z: number, width: number, height: number, depth: number } | null
}

export interface Box {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
  }
