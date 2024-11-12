import type {Vector3} from 'three'

export interface Tool {
    id: string
    name: string
    icon: string
    active: boolean
}

export interface Annotation {
    id: string
    type: 'box' | 'polygon'
    label: string
    points: Vector3[]
    x: number
    y: number
    z: number
    width: number,
    height: number,
    depth: number
    color: number
}