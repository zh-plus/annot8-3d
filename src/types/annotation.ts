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
    points: Vector3[]
    label: string
}