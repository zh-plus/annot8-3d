import { promises } from 'dns';
import type {Annotation} from '../types/annotation';
import axios from 'axios';
import type {Vector3} from 'three'
import { i } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';
import { todo } from 'node:test';

export function mapAnnotationsToBackendFormat(annotation: Annotation) {
    return {
      id: 1, // 转为数字
      pcd_file_id: "000021.pcd", // 可选字段
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
        x:  0, // 假设前端数据有 `rotationX` 等字段
        y:  0,
        z:  0,
      },
    }  
}
export async function save_annotations(projectId: number,annotations:Annotation[]) {
    try {
        const token = localStorage.getItem("token");
        const backendAnnotations = mapAnnotationsToBackendFormat(annotations[0]); // 转换为后端格式
        console.log('request',backendAnnotations)
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
            "http://127.0.0.1:8080/annotations/projects/0/episodes/0/save_annotations",
             backendAnnotations,
             {
                headers: {
                    Authorization: `Bearer ${token}`, // 添加认证头部
                    "Content-Type": "application/json", // 设置请求体类型
                },
            },
            
        );
        if(response['data']==true){
            alert('save successfully')
        }
    } catch (error) {
      console.error('Failed to fetch annotations:', error);
      // You can handle errors or show a message to the user here
    }
  }


  export async function get_annotations(projectId: number):Promise<Annotation[]>{
    try {
        const token = localStorage.getItem("token");
        const file_name = "000021.pcd"
        const res = await axios.get(
        "http://127.0.0.1:8080/annotations/projects/0/episodes/0/annotations/000021.pcd",
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
    );
     const item =  res.data
     console.log ('get annotation!!!',item)
     const annotation: Annotation[] = [{
        id: item.id,
        type: item.geometry,  
        label: item.label ,
        points: [],
        x: item.position.x ,
        y: item.position.y ,
        z: item.position.z ,
        width: item.size.width ,
        height: item.size.height ,
        depth: item.size.depth ,
        color: 0 ,
      }];
      return annotation
    } catch (error) {
      console.error('Failed to fetch annotations:', error);
      return []
      // You can handle errors or show a message to the user here
    }
  }