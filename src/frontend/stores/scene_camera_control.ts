import {defineStore} from 'pinia'
import type {SceneCamera, BoxPosition, BoxRotation} from './types'
import {VIEWER_DEFAULTS} from '@/constants'
import {shallowRef} from 'vue';
import * as THREE from "three";
import {THREE_SCENE_COLORS} from "../constants";
import {CameraPosition} from "../types";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {OrthographicCamera, PerspectiveCamera, Vector3} from "three";

export const useSceneCamera = defineStore('scene', {
    state: (): SceneCamera => ({
        scene: shallowRef(undefined),
        camera: shallowRef(undefined),
        current_side_camera: shallowRef(undefined),
        current_head_camera: shallowRef(undefined),
        current_front_camera: shallowRef(undefined),
        camera_side_ort: shallowRef(undefined),
        camera_side_per: shallowRef(undefined),
        camera_head_ort: shallowRef(undefined),
        camera_head_per: shallowRef(undefined),
        camera_front_ort: shallowRef(undefined),
        camera_front_per: shallowRef(undefined),
        type: 0,
        boxPosition: {x: 0, y: 0, z: 0},
        boxRotation: {rotationX: 0, rotationY: 0, rotationZ: 0},
        aspect: 0,
        distance: 0,
        seal_sphere: undefined
    }),
    actions: {
        createAdjustableCube() {
            if (this.type === 1) {
                if (!this.scene) return null
                const geometry = new THREE.SphereGeometry(this.distance * 1.05, 32,32); // 设置默认的 1x1x1 正方体
                const material = new THREE.MeshBasicMaterial({
                    color: 0x000000,  // 黑色
                    side: THREE.DoubleSide, // 渲染正反面
                    transparent: false // 不透明
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(this.boxPosition.x, this.boxPosition.y, this.boxPosition.z);
                //cube.scale.set(this.distance * 1.2, this.distance * 1.2, this.distance * 1.2)
                this.scene.add(sphere)
                return sphere
            }
        },
        ini_camera(container: HTMLElement, cameraPosition: CameraPosition) {
            const camera = new THREE.PerspectiveCamera(
                VIEWER_DEFAULTS.fov,
                container.clientWidth / container.clientHeight,
                VIEWER_DEFAULTS.near,
                VIEWER_DEFAULTS.far
            )
            camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
            this.camera = camera
            console.log("ini_camera successfully")
            return this.camera
        },
        ini_scene() {
            const scene = new THREE.Scene()
            scene.background = new THREE.Color(THREE_SCENE_COLORS.background)
            this.scene = scene
            console.log("ini_scene successfully")
            return this.scene
        },
        ini_camera_side_per(container: HTMLElement, baseCamera: PerspectiveCamera, cameraDirection: Vector3, cameraDirectionSide: Vector3) {
            const offset = 5
            const camera_per = new THREE.PerspectiveCamera(
                VIEWER_DEFAULTS.fov,
                container.clientWidth / container.clientHeight,
                VIEWER_DEFAULTS.near,
                VIEWER_DEFAULTS.far
            );
            camera_per.position.set(
                baseCamera.position.x + (cameraDirection.x + cameraDirectionSide.x) * offset,
                baseCamera.position.y,
                baseCamera.position.z + (cameraDirectionSide.z + cameraDirection.z) * offset
            );
            camera_per.lookAt(baseCamera.position.x, baseCamera.position.y, baseCamera.position.z);
            this.camera_side_per = camera_per;
            this.current_side_camera = this.camera_side_per;
            console.log("ini_camera_side_per successfully")
            return this.current_side_camera
        },
        update_camera_side(controls: OrbitControls[], mainPosition: Vector3, mainTarget: Vector3) {
            const distance = mainTarget.distanceTo(mainPosition);
            this.distance = distance
            const forwardDirection = new THREE.Vector3().subVectors(mainTarget, mainPosition).normalize();
            const rightDirection = new THREE.Vector3().crossVectors(forwardDirection, new THREE.Vector3(0, 1, 0)).normalize();
            if (this.type == 0) {
                controls[0].object.position.set(
                    mainPosition.x + (forwardDirection.x + rightDirection.x) * distance, // Fixed position for side view
                    mainPosition.y,
                    mainPosition.z + (forwardDirection.z + rightDirection.z) * distance
                )

                controls[0].target.set(
                    mainTarget.x,
                    mainTarget.y,
                    mainTarget.z
                )
                controls[0].update()
            } else {
                controls[1].object.position.set(
                    this.boxPosition.x + (forwardDirection.x + rightDirection.x) * distance,
                    this.boxPosition.y,
                    this.boxPosition.z
                )
                controls[1].target.set(
                    this.boxPosition.x,
                    this.boxPosition.y,
                    this.boxPosition.z
                )
                if (this.current_side_camera instanceof OrthographicCamera) {
                    this.update_ort_scale(this.current_side_camera, distance)
                }
                controls[1].update()
            }
        },
        ini_camera_head_per(container: HTMLElement, baseCamera: PerspectiveCamera, cameraDirection: Vector3, cameraDirectionSide: Vector3) {
            const camera_per = new THREE.PerspectiveCamera(
                VIEWER_DEFAULTS.fov,
                container.clientWidth / container.clientHeight,
                VIEWER_DEFAULTS.near,
                VIEWER_DEFAULTS.far
            );
            camera_per.position.set(
                baseCamera.position.x,
                baseCamera.position.y + 5,
                baseCamera.position.z
            );
            camera_per.up.set(0, 0, -1); // 设置相机的 "上" 方向
            camera_per.lookAt(baseCamera.position.x, baseCamera.position.y, baseCamera.position.z);
            this.camera_head_per = camera_per;
            this.current_head_camera = this.camera_head_per;
            console.log("ini_camera_head_per successfully")
            return this.current_head_camera
        },
        update_camera_head(controls: OrbitControls[], mainPosition: Vector3, mainTarget: Vector3) {
            if (this.current_head_camera) {
                this.current_head_camera.up.set(0, 0, -1); // 设置相机的 "上" 方向
                if (this.type == 0) {
                    controls[0].object.position.set(
                        mainPosition.x, // Fixed position for side view
                        mainPosition.y + 5,
                        mainPosition.z
                    )
                    controls[0].target.set(
                        mainTarget.x,
                        mainTarget.y,
                        mainTarget.z
                    )
                    controls[0].update()
                } else {
                    this.current_head_camera.up.set(0, -1, 0); // 设置相机的 "上" 方向
                    controls[1].object.position.set(
                        this.boxPosition.x,
                        this.boxPosition.y + this.distance,
                        this.boxPosition.z
                    )
                    controls[1].target.set(
                        this.boxPosition.x,
                        this.boxPosition.y,
                        this.boxPosition.z
                    )
                    if (this.current_head_camera instanceof OrthographicCamera) {
                        this.update_ort_scale(this.current_head_camera, this.distance)
                    }
                    controls[1].update()
                }
            }
        },
        ini_camera_front_per(container: HTMLElement, baseCamera: THREE.PerspectiveCamera, cameraDirection: THREE.Vector3, cameraDirectionSide: THREE.Vector3) {
            const offset = 5
            const camera_per = new THREE.PerspectiveCamera(
                VIEWER_DEFAULTS.fov,
                container.clientWidth / container.clientHeight,
                VIEWER_DEFAULTS.near,
                VIEWER_DEFAULTS.far
            );
            camera_per.position.set(
                -(baseCamera.position.x + offset * (cameraDirectionSide.x + cameraDirection.x)),
                baseCamera.position.y,
                -(baseCamera.position.z + offset * (cameraDirectionSide.z + cameraDirection.z))
            );
            camera_per.lookAt(baseCamera.position.x, baseCamera.position.y, baseCamera.position.z);
            this.camera_front_per = camera_per;
            this.current_front_camera = this.camera_front_per;
            console.log("ini_camera_front_per successfully")
            return this.current_front_camera
        },
        update_camera_front(controls: OrbitControls[], mainPosition: Vector3, mainTarget: Vector3) {
            const forwardDirection = new THREE.Vector3().subVectors(mainTarget, mainPosition).normalize();
            if (this.type == 0) {
                controls[0].object.position.set(
                    mainPosition.x + (forwardDirection.x) * 2 * this.distance, // Fixed position for side view
                    mainPosition.y,
                    mainPosition.z + (forwardDirection.z) * 2 * this.distance
                )
                // Keep looking along X axis
                controls[0].target.set(
                    mainTarget.x,
                    mainTarget.y,
                    mainTarget.z
                )
                controls[0].update()
            } else {
                controls[1].object.position.set(
                    this.boxPosition.x,
                    this.boxPosition.y,
                    this.boxPosition.z + this.distance
                )
                controls[1].target.set(
                    this.boxPosition.x,
                    this.boxPosition.y,
                    this.boxPosition.z
                )
                if (this.current_front_camera instanceof OrthographicCamera) {
                    this.update_ort_scale(this.current_front_camera, this.distance)
                }
                controls[1].update()
            }
        },
        ini_camera_ort(container: HTMLElement, baseCamera: THREE.PerspectiveCamera, type: string) {
            const frustumSize = 10; // 定义视野的大小
            const aspect = container.clientWidth / container.clientHeight; // 宽高比
            this.aspect = aspect
            const camera_ort = new THREE.OrthographicCamera(
                -frustumSize * aspect / 2, // left
                frustumSize * aspect / 2,  // right
                frustumSize / 2,           // top
                -frustumSize / 2,          // bottom
                1,                         // near plane
                1000                       // far plane
            );
            camera_ort.position.set(baseCamera.position.x, baseCamera.position.y, baseCamera.position.z);
            switch (type) {
                case "side":
                    this.camera_side_ort = camera_ort;
                    console.log("ini_camera_side_ort successfully")
                    break;
                case "overhead":
                    camera_ort.up.set(0, -1, 0)
                    camera_ort.position.set(
                        this.boxPosition.x,
                        this.boxPosition.y + 5,
                        this.boxPosition.z
                    )
                    this.camera_head_ort = camera_ort;
                    console.log("ini_camera_head_ort successfully")
                    break;
                case "front":
                    this.camera_front_ort = camera_ort;
                    console.log("ini_camera_front_ort successfully")
                    break;
                default:
                    console.warn("Invalid camera type:", type);
                    return null;
            }
            return camera_ort
        },
        update_ort_scale(ort_camera: OrthographicCamera, distance: number) {
            ort_camera.left = -distance * this.aspect / 2
            ort_camera.right = distance * this.aspect / 2
            ort_camera.top = distance / 2
            ort_camera.bottom = -distance / 2
            ort_camera.updateProjectionMatrix();
        },
        //后续传入BBox头部方向
        //主视角状态先不变
        set_observe_camera(boxPosition: BoxPosition, boxRotation: BoxRotation) {
            if (this.camera_side_ort && this.camera_head_ort && this.camera_front_ort) {
                this.boxPosition = boxPosition
                this.boxRotation = boxRotation
                let rotationX = boxRotation.rotationX
                let rotationY = boxRotation.rotationY
                let rotationZ = boxRotation.rotationZ
                this.current_front_camera = this.camera_front_ort
                this.current_head_camera = this.camera_head_ort
                this.current_side_camera = this.camera_side_ort
                this.type = 1
                //this.createAdjustableCube()
            }
        },
        reset_observe_camera() {
            if (this.camera && this.camera_side_per && this.camera_head_per && this.camera_front_per) {
                this.current_front_camera = this.camera_front_per
                this.current_head_camera = this.camera_head_per
                this.current_side_camera = this.camera_side_per
                this.type = 0
                // if(this.scene && this.seal_sphere){
                //     this.scene.remove(this.seal_sphere)
                //     this.seal_sphere = undefined
                // }
            }
        }
    }
})