import {promises} from 'dns';
import type {Annotation} from '../types';
import axios from 'axios';
import type {Vector3} from 'three'
import {i} from 'node_modules/vite/dist/node/types.d-aGj9QkWt';
import {todo} from 'node:test';

export function mapAnnotationsToBackendFormat(annotations: Annotation[], filename: string) {
    return annotations.map(annotation => ({
        id: annotation.id, // 假设 ID 是固定的，实际可以使用 annotation 的某个唯一标识
        pcd_file_id: filename, // 可选字段
        label: annotation.label[0], // 假设前端 `label` 是一个数组，取第一个元素
        geometry: "cube", // 对应后端的 `geometry`
        size: {
            width: annotation.width,
            height: annotation.height,
            depth: annotation.depth, // 假设前端没有 radius，但有 depth
        },
        position: {
            x: annotation.x,
            y: annotation.y,
            z: annotation.z,
        },
        rotation: {
            x: 0, // 假设没有提供旋转信息，默认值为 0
            y: 0,
            z: 0,
        },
    }));
}

export async function save_annotations(projectId: number, episode: number, annotations: Annotation[], filename: string) {
    try {
        const token = localStorage.getItem("token");
        const backendAnnotations = mapAnnotationsToBackendFormat(annotations, filename); // 转换为后端格式
        console.log('request', backendAnnotations)
        // const body = 
        // {
        //     "id": 0,
        //     "pcd_file_id": "000021.pcd",
        //     "label": "car",
        //     "geometry": "cube",
        //     "size": {},
        //     "position": {},
        //     "rotation": {}
        //     }
        // ;
        const response = await axios.put(
            `http://127.0.0.1:8080/annotations/projects/${projectId}/episodes/${episode}/save_annotations`,
            backendAnnotations,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 添加认证头部
                    "Content-Type": "application/json", // 设置请求体类型
                },
            },
        );
        if (response['data'] == true) {
            alert('save successfully')
        }
    } catch (error) {
        console.error('Failed to fetch annotations:', error);
        // You can handle errors or show a message to the user here
    }
}


export async function get_annotations(projectId: number, episode: number, file_name: string): Promise<Annotation[]> {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `http://127.0.0.1:8080/annotations/projects/${projectId}/episodes/${episode}/annotations/${file_name}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const got_annotations = res.data
        //之前没有规定Annotation类型
        const annotations: Annotation[] = got_annotations.map((annotation: Annotation) => ({
            id: annotation.id,
            type: annotation.type,
            label: [annotation.label],
            points: [],
            x: annotation.x,
            y: annotation.y,
            z: annotation.z,
            width: annotation.width,
            height: annotation.height,
            depth: annotation.depth,
            color: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
        }));


        //  console.log ('get annotation!!!',item)
        //  const annotation: Annotation[] = [{
        //     id: item.id,
        //     type: item.geometry,
        //     label: item.label ,
        //     points: [],
        //     x: item.position.x ,
        //     y: item.position.y ,
        //     z: item.position.z ,
        //     width: item.size.width ,
        //     height: item.size.height ,
        //     depth: item.size.depth ,
        //     color: 0 ,
        //   }];
        return annotations
    } catch (error) {
        console.error('Failed to fetch annotations:', error);
        return []
        // You can handle errors or show a message to the user here
    }
}