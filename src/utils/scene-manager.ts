import * as THREE from 'three'
import {createPointCloudGeometry, createPointCloudMaterial, generateDummyPointCloud} from '@/utils/point-cloud'
import type {ViewerContext} from '@/types'

export function setupScene(viewerContext: ViewerContext) {
    // Generate dummy point cloud
    const pointCloudData = generateDummyPointCloud()
    const geometry = createPointCloudGeometry(pointCloudData)
    const material = createPointCloudMaterial()

    // Create points object and add to scene
    const points = new THREE.Points(geometry, material)
    viewerContext.scene.add(points)

    return {
        points
    }
}