import * as THREE from 'three'
import {createPointCloudGeometry, createPointCloudMaterial, generateDummyPointCloud,loadPointCloudFromPCD,loadPointCloudFromOBJ} from '@/utils/point-cloud'
import type {ViewerContext} from '@/types'
import {useAnnotationStore} from "@/stores";
import { storeToRefs } from 'pinia'; 


export function setupScene(viewerContext: ViewerContext,path:string) {
    if(path == 'None' || path ==null ){// Generate dummy point cloud
        const pointCloudData = generateDummyPointCloud()
        const geometry = createPointCloudGeometry(pointCloudData)
        const material = createPointCloudMaterial()
    
        // Create points object and add to scene
        const points = new THREE.Points(geometry, material)
        viewerContext.scene.add(points)

        return {
            points
        }}
    else{
        const isPCD = () => path.toLowerCase().endsWith('.pcd');
        const isOBJ = () => path.toLowerCase().endsWith('.obj');
        if (isPCD()) {
        path ='src/assets/PCD_cloud/drive_33_north_to_south/point_clouds/vehicle_lidar_robosense/' + path  
        console.log(path)
            loadPointCloudFromPCD(path,viewerContext.scene)
        }
        if (isOBJ()){
            path = 'src/assets/obj_file_demo/0a0f0cf2-3a34-4ba2-b24f-34f361c36b3e/'+path
            loadPointCloudFromOBJ(path, viewerContext.scene)
        }
        const AnnotationStore = useAnnotationStore()
        const { annotations } = storeToRefs(AnnotationStore); 

        annotations.value.forEach((annotation) => {
          const BBox = AnnotationStore.CreatBBox_byPositoin(annotation.x, annotation.y, annotation.z,annotation.label[0],annotation.width, annotation.height,annotation.depth)
          viewerContext.scene.add(BBox)
        });
    }
}

export function clearScene(scene: THREE.Scene) {
    while (scene.children.length > 0) {
      const child = scene.children[0];
      if (child instanceof THREE.Mesh) {
        // 释放几何体和材质资源
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
      scene.remove(child);
    }
  }
  
