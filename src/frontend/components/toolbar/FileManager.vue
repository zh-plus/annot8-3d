<template>
    <div>
      <button @click="showDirectory">文件管理器</button>
      <div v-if="treeData">
        <div v-if="currentLevel === 1">
          <ul>
            <li v-for="project in treeData.projects" :key="project.name">
              <button @click="openProject(project.name)">{{ project.name }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentLevel === 2">
          <ul>
            <li v-for="subDir in currentProject?.subDirs" :key="subDir.name">
              <button @click="openSubDir(subDir.name)">📂 {{ subDir.name }}</button>
            </li>
          </ul>
        </div>
        <div v-else-if="currentLevel === 3">
          <ul>
            <li v-for="file in currentPointcloudFiles" :key="file">
            📄 {{ file }}
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
    // demo json data
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
</script>
  
<style scoped>
  button {
    margin: 5px;
    padding: 10px;
    cursor: pointer;
  }
</style>
  