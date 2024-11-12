import {defineStore} from 'pinia'
import type {AnnotationState} from './types'
import type {Annotation} from '@/types'
import {v4 as uuidv4} from 'uuid'
import * as THREE from "three";

export const useAnnotationStore = defineStore('annotation', {
    state: (): AnnotationState => ({
        annotations: [],
        selectedAnnotation: null,
        isDrawing: false,
        //add new
        currentBox: {x: 0, y: 0, z: 0, width: 1, height: 1, depth: 1},
        draggingAnnotation: false // 新增状态，用来表示当前拖拽的注解
    }),
    actions: {
        addAnnotation(annotation: {
            x: number;
            y: number;
            z: number;
            depth: number;
            width: number;
            height: number;
            color: number
        }) {
            const newBBAnnotation: Omit<Annotation, 'id'> = {
                type: 'box',  // 指定类型为方框
                label: 'Car', // 这里可以设定一个默认的标签
                points: [],   // 假设没有points
                x: annotation.x,
                y: annotation.y,
                z: annotation.z,
                depth: annotation.depth,
                width: annotation.width,
                height: annotation.height,
                color: annotation.color
            }
            this.annotations.push({
                id: uuidv4(),
                ...newBBAnnotation
            })
            console.log("new annotation added:", annotation)
        },
        CreatBBox(intersects: THREE.Intersection[], label: string, width: number, height: number, depth: number) {
            // 创建边界框
            const geometry = new THREE.BoxGeometry(width, height, depth)
            const edges = new THREE.EdgesGeometry(geometry)
            let color = 0xffffff
            // 与label tool关联后需要修改
            switch (label) {
                case 'Car':
                    color = 0x00ff00;
                    break;
                case 'Pedestrian':
                    color = 0xff0000;
                    break;
                case 'Cyclist':
                    color = 0x0000ff;
                    break;
                case 'Traffic Sign':
                    color = 0xffff00;
                    break;
            }
            const material = new THREE.LineBasicMaterial({color: color})
            const boundingBox = new THREE.LineSegments(edges, material)
            if (intersects.length > 0) {
                const intersection = intersects[0]
                boundingBox.position.copy(intersection.point)
                this.addAnnotation({
                    x: intersection.point.x,
                    z: intersection.point.z,
                    y: intersection.point.y,
                    width: width,
                    height: height,
                    depth: depth,
                    color: color,
                })
            } else {
                boundingBox.position.set(0, 0, 0)
            }
            // 保存尺寸和位置到 userData
            boundingBox.userData.dimensions = {
                width,
                height,
                depth,
                position: {
                    x: boundingBox.position.x,
                    y: boundingBox.position.y,
                    z: boundingBox.position.z,
                }
            };
            return boundingBox;
        },
        removeAnnotation(id: string) {
            const index = this.annotations.findIndex(a => a.id === id)
            if (index !== -1) {
                this.annotations.splice(index, 1)
                if (this.selectedAnnotation === id) {
                    this.selectedAnnotation = null
                }
            }
        },

        setDrawingState(isDrawing: boolean) {
            this.isDrawing = isDrawing
        },

        selectAnnotation(id: string | null) {
            this.selectedAnnotation = id
        },
        setCurrentBox(box: { x: number, y: number, z: number, width: number, height: number, depth: number }) {
            this.currentBox = box
        },
        updateAnnotation(id: string | null, x: number, y: number, z: number, width: number, height: number, depth: number) {
            if (id != null) {
                const annotation = this.annotations.find(a => a.id === id)
                if (annotation) {
                    annotation.x = x
                    annotation.y = y
                    annotation.z = z
                    annotation.width = width
                    annotation.height = height
                    annotation.depth = depth
                }
            }
        }
    }
})