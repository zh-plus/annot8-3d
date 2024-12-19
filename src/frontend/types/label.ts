import * as THREE from 'three'
import {BBoxItem} from '../types/annotation'

export interface Label {
    id: string
    name: string
    color?: string
    BBox: BBoxItem[]
}