<template>
    <div>
      <button @click="showDirectory" class="main-button">File Manager</button>
      <div v-if="treeData" class="directory-container">
        <div v-if="currentLevel > 1">
            <button @click="goBack" class="back-button">⬅️ Go back</button>
        </div>
        <div v-if="currentLevel === 1">
          <ul class="directory-list">
            <li v-for="project in treeData.projects" :key="project.name">
              <button @click="openProject(project.name)" class="directory-button">📁 {{ project.name }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentLevel === 2">
          <ul class="directory-list">
            <li v-for="Episode in currentProject?.Episodes" :key="Episode.name">
              <button @click="openEpisode(Episode.name)" class="directory-button">📂 {{ Episode.name }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentLevel === 3">
          <ul class="directory-list">
            <li v-for="file in currentPointcloudFiles" :key="file">
              <button @click="openPCD(file)" class="file-item">📄 {{ file.split('/').pop() }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { useFileStore } from '@/stores/file.ts';
import { File_Anno } from '@/types';
import { log } from 'console';
  const fileStore = useFileStore();

  interface PointcloudFile {
    name: string;
    pointcloudFiles: string[];
  }
  
  interface Episode {
    name: string;
    pointcloudFiles: string[];
  }
  
  interface Project {
    name: string;
    Episodes: Episode[];
  }
  
  const treeData = ref<{ projects: Project[] } | null>(null);
  const currentLevel = ref(1);
  const currentProject = ref<Project | null>(null);
  const currentEpisode = ref<Episode | null>(null);
  const currentPointcloudFiles = ref<string[]>([]);
  
  const showDirectory = async () => {
    // assume we get the tree data from the backend
    // a demo tree data
    const token = localStorage.getItem('token');
    const res = await axios.get(
      'http://127.0.0.1:8080/projects/list',
      {
        headers: {
          Authorization: `Bearer ${token}`, // 添加认证头部
          "Content-Type": "application/json", // 设置请求体类型
        },
      }
    );

    // treeData.value = {
    //   projects: [
    //     {
    //       name: 'project_1',
    //       Episodes: [
    //         {
    //           name: 'ds0',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //       ],
    //     },
    //     {
    //       name: 'project_2',
    //       Episodes: [
    //         {
    //           name: 'ds1',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //         {
    //           name: 'ds2',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //         {
    //           name: 'ds3',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //         {
    //           name: 'ds4',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //         {
    //           name: 'ds5',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //         {
    //           name: 'ds6',
    //           pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
    //         },
    //       ],
    //     },
    //   ],
    // };
    treeData.value = res['data'];
    console.log(treeData.value);
  };
  
  const openProject = (projectName: string) => {
    if (treeData.value) {
      currentProject.value = treeData.value.projects.find(
        (project) => project.name === projectName
      ) || null;
      currentLevel.value = 2;
    }
  };
  
  const openEpisode = (EpisodeName: string) => {
    if (currentProject.value) {
      currentEpisode.value = currentProject.value.Episodes.find(
        (Episode) => Episode.name === EpisodeName
      ) || null;
      if (currentEpisode.value) {
        currentPointcloudFiles.value = currentEpisode.value.pointcloudFiles;
        currentLevel.value = 3;
      }
    }
  };

  const goBack = () => {
    if (currentLevel.value === 3) {
        currentLevel.value = 2;
        currentPointcloudFiles.value = [];
    } else if (currentLevel.value === 2) {
        currentLevel.value = 1;
        currentProject.value = null;
    }
  };

  const openPCD = (pcdPath: string) => {
    // axios.get(pcdPath).then((response) => {
    //   console.log(response);
    // });
    const userConfirmed = window.confirm("If you select file, all unsaved changes will be lost!");
    if (!userConfirmed) {
      return;
    }
    if (pcdPath.startsWith('http')) {
      // request for pcd file from server
      axios.get(pcdPath).then((response) => {
        console.log(response);
      });
    }
    else {
      // read pcd file from local
      console.log('Open PCD:', pcdPath);
      // find relative path from the root

      const file: File_Anno= {
        file:{
          name: pcdPath.split('/').pop() || "",
          file_path: pcdPath
        },
        annotations: []
      }
      fileStore.setSelectedFile(file);

    }
    
  };

</script>
  
<style scoped>
  .main-button {
    background-color: #fcfeff;
    color: rgb(0, 0, 0);
    padding: 15px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .main-button:hover {
    background-color: #0ba2e8;
  }
  
  .directory-container {
    margin-top: 5px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .back-button {
    background-color: #f0e6d8;
    color: rgb(0, 0, 0);
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 15px;
    transition: background-color 0.3s ease;
    width: 100%;
  }

  .back-button:hover {
    background-color: #ec971f;
  }

  .directory-list {
    list-style-type: none;
    padding: 0;
  }
  
  .directory-button {
    background-color: #feffff;
    color: rgb(0, 0, 0);
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .directory-button:hover {
    background-color: #007bb5;
  }
  
  .file-item {
    display: block;
    background-color: #e7e7e7;
    color: #333;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 5px;
    width: 100%;
  }
  </style>
  