import {defineStore} from 'pinia'
import type {SceneCamera} from './types'
import {VIEWER_DEFAULTS} from '@/constants'
import {PointCloudMetadata} from '@/types'
import * as THREE from "three";

export const useSceneCamera = defineStore('scene', {
    state: (): SceneCamera => ({
        scene: undefined,
        camera: undefined,
        camera_side: undefined,
        camera_head: undefined,
        camera_rear: undefined,
    }),
    actions: {
        set_scene(scene: THREE.Scene) {
            this.scene = scene;
        },
        add_annot(annot: THREE.LineSegments) {
            this.scene?.add(annot);
        },
        set_camera(camera: THREE.PerspectiveCamera) {
            this.camera = camera;
        },
        set_side_camera(camera_side: THREE.PerspectiveCamera) {
            this.camera_side = camera_side;
        },
        set_head_camera(camera_head: THREE.PerspectiveCamera) {
            this.camera_head = camera_head;
        },
        set_rear_camera(camera_rear: THREE.PerspectiveCamera) {
            this.camera_rear = camera_rear;
        },
        //后续传入BBox头部方向
        //主视角状态先不变
        set_observe_camera(camera_observe: THREE.PerspectiveCamera) {
            if (this.camera_side && this.camera_head && this.camera_rear) {
                //this.camera_side
            }
        },
        cancel_observe_camera(camera_observe: THREE.PerspectiveCamera) {
            if (this.camera && this.camera_side && this.camera_head && this.camera_rear) {

                const cameraDirection = new THREE.Vector3();
                this.camera.getWorldDirection(cameraDirection); // 获取视线方向
                const cameraDirectionSide = new THREE.Vector3();
                cameraDirectionSide.cross(new THREE.Vector3(0, 1, 0)).normalize(); // 计算右侧方向（垂直于视线）

                const offset = 5;

                this.camera_side.position.set(
                    this.camera.position.x + 3 + offset * (cameraDirectionSide.x + cameraDirection.x),
                    this.camera.position.y,
                    this.camera.position.z + 3 + offset * (cameraDirectionSide.z + cameraDirection.z)
                );
                this.camera_side.lookAt(this.camera.position.x, this.camera.position.y, this.camera.position.z);

                this.camera_head.position.set(
                    this.camera.position.x,
                    this.camera.position.y + 3,
                    this.camera.position.z
                );
                this.camera_head.up.set(0, 0, -1); // 设置相机的 "上" 方向
                this.camera_head.lookAt(this.camera.position.x, this.camera.position.y, this.camera.position.z);

                this.camera_rear.position.set(
                    -(this.camera.position.x + 3 + offset * (cameraDirectionSide.x + cameraDirection.x)),
                    this.camera.position.y,
                    -(this.camera.position.z + 3 + offset * (cameraDirectionSide.z + cameraDirection.z))
                );
                this.camera_rear.lookAt(this.camera.position.x, this.camera.position.y, this.camera.position.z);
            }
        }
    }
})