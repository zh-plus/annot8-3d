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
            <li v-for="subDir in currentProject?.subDirs" :key="subDir.name">
              <button @click="openSubDir(subDir.name)" class="directory-button">📂 {{ subDir.name }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentLevel === 3">
          <ul class="directory-list">
            <li v-for="file in currentPointcloudFiles" :key="file">
              <span class="file-item">📄 {{ file }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  
  interface PointcloudFile {
    name: string;
    pointcloudFiles: string[];
  }
  
  interface SubDir {
    name: string;
    pointcloudFiles: string[];
  }
  
  interface Project {
    name: string;
    subDirs: SubDir[];
  }
  
  const treeData = ref<{ projects: Project[] } | null>(null);
  const currentLevel = ref(1);
  const currentProject = ref<Project | null>(null);
  const currentSubDir = ref<SubDir | null>(null);
  const currentPointcloudFiles = ref<string[]>([]);
  
  const showDirectory = () => {
    // assume we get the tree data from the backend
    // a demo tree data
    treeData.value = {
      projects: [
        {
          name: 'project_1',
          subDirs: [
            {
              name: 'ds0',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
          ],
        },
        {
          name: 'project_2',
          subDirs: [
            {
              name: 'ds1',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
            {
              name: 'ds2',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
            {
              name: 'ds3',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
            {
              name: 'ds4',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
            {
              name: 'ds5',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
            {
              name: 'ds6',
              pointcloudFiles: ['000021.pcd', '000022.pcd', '000023.pcd'],
            },
          ],
        },
      ],
    };
  };
  
  const openProject = (projectName: string) => {
    if (treeData.value) {
      currentProject.value = treeData.value.projects.find(
        (project) => project.name === projectName
      ) || null;
      currentLevel.value = 2;
    }
  };
  
  const openSubDir = (subDirName: string) => {
    if (currentProject.value) {
      currentSubDir.value = currentProject.value.subDirs.find(
        (subDir) => subDir.name === subDirName
      ) || null;
      if (currentSubDir.value) {
        currentPointcloudFiles.value = currentSubDir.value.pointcloudFiles;
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
  }
  </style>
  