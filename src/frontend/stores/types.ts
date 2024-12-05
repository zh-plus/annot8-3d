import type {Annotation, Label, PointCloudChunk, PointCloudMetadata, Tool} from '@/types'
import type {Vector3} from 'three'
import type {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from "three";
import {ShallowRef} from "vue";

export interface CameraState {
    position: Vector3
    target: Vector3
}

export interface ViewportState {
    activeView: 'main' | 'overhead' | 'side' | 'front'
    cameraPositions: Record<string, { x: number; y: number; z: number }>
    syncEnabled: boolean
    mainCameraState: CameraState
    viewerControls: Map<string, OrbitControls[]>
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

export interface SceneCamera {
    scene?: ShallowRef<THREE.Scene | undefined>;
    camera?: ShallowRef<THREE.PerspectiveCamera | undefined>;
    current_side_camera?: ShallowRef<THREE.OrthographicCamera | THREE.PerspectiveCamera | undefined>;
    current_head_camera?: ShallowRef<THREE.OrthographicCamera | THREE.PerspectiveCamera | undefined>;
    current_front_camera?: ShallowRef<THREE.OrthographicCamera | THREE.PerspectiveCamera | undefined>;
    camera_side_ort?: ShallowRef<THREE.OrthographicCamera | undefined>;
    camera_side_per?: ShallowRef<THREE.PerspectiveCamera | undefined>;
    camera_head_ort?: ShallowRef<THREE.OrthographicCamera | undefined>;
    camera_head_per?: ShallowRef<THREE.PerspectiveCamera | undefined>;
    camera_front_ort?: ShallowRef<THREE.OrthographicCamera | undefined>;
    camera_front_per?: ShallowRef<THREE.PerspectiveCamera | undefined>;
    type: number
    boxPosition: BoxPosition
    boxRotation: BoxRotation
    aspect: number
    distance: number
    seal_sphere: THREE.Mesh | undefined
}

export interface AnnotationState {
    annotations: Annotation[]
    selectedAnnotation: string | null
    isDrawing: boolean
    //add new
    currentBox: {
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number,
        rotationX: number,  // 绕 X 轴旋转
        rotationY: number,  // 绕 Y 轴旋转
        rotationZ: number,   // 绕 Z 轴旋转
    } | null
}

export interface Box {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
}

export interface BoxPosition {
    x: number;
    y: number;
    z: number;
}

export interface BoxDimensions {
    width: number;
    height: number;
    depth: number;
}

export interface BoxRotation {
    rotationX: number;  // 绕 X 轴旋转
    rotationY: number; // 绕 Y 轴旋转
    rotationZ: number;   // 绕 Z 轴旋转
}