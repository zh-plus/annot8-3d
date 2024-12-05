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
    label: string[]
    points: Vector3[]|any
    x: number
    y: number
    z: number
    width: number,
    height: number,
    depth: number
    color: number
}

export interface File_Anno {
    file:File
    annotations: Annotation[]
}
export interface Folder{
    id:string
    files: File_Anno[]
}
export interface File{
    name:string
    file_path:string
}