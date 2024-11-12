import * as THREE from 'three';
import type {Point, PointCloudChunk} from '@/types/point-cloud';
import {VIEWER_DEFAULTS} from '@/constants'

// Generate dummy point cloud data for testing
export function generateDummyPointCloud(pointCount: number = VIEWER_DEFAULTS.pointBudget / 10): PointCloudChunk {
    const points: Point[] = [];
    const bounds = {
        min: [Infinity, Infinity, Infinity] as [number, number, number],
        max: [-Infinity, -Infinity, -Infinity] as [number, number, number]
    };

    for (let i = 0; i < pointCount; i++) {
        const x = (Math.random() - 0.5) * 1;
        const y = (Math.random() - 0.5) * 1;
        const z = (Math.random() - 0.5) * 1;

        // Update bounds
        bounds.min[0] = Math.min(bounds.min[0], x);
        bounds.min[1] = Math.min(bounds.min[1], y);
        bounds.min[2] = Math.min(bounds.min[2], z);
        bounds.max[0] = Math.max(bounds.max[0], x);
        bounds.max[1] = Math.max(bounds.max[1], y);
        bounds.max[2] = Math.max(bounds.max[2], z);

        points.push({
            position: [x, y, z],
            color: [Math.random(), Math.random(), Math.random()],
            intensity: Math.random(),
            classification: Math.floor(Math.random() * 10)
        });
    }

    return {
        points,
        bounds,
        level: 1
    };
}

// Create Three.js geometry from point cloud data
export function createPointCloudGeometry(chunk: PointCloudChunk): THREE.BufferGeometry {
    const positions = new Float32Array(chunk.points.length * 3);
    const colors = new Float32Array(chunk.points.length * 3);

    chunk.points.forEach((point, index) => {
        const i = index * 3;
        positions[i] = point.position[0];
        positions[i + 1] = point.position[1];
        positions[i + 2] = point.position[2];

        if (point.color) {
            colors[i] = point.color[0];
            colors[i + 1] = point.color[1];
            colors[i + 2] = point.color[2];
        } else {
            // Default color if none provided
            colors[i] = 1;
            colors[i + 1] = 1;
            colors[i + 2] = 1;
        }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
}

// Point cloud material with size attenuation
export function createPointCloudMaterial(pointSize: number = 1): THREE.PointsMaterial {
    return new THREE.PointsMaterial({
        size: VIEWER_DEFAULTS.pointSize,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });
}