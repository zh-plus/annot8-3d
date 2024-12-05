import {defineStore,storeToRefs} from 'pinia'
import type {LabelState} from './types'
import { useAnnotationStore } from './annotation'
import {v4 as uuidv4} from 'uuid'
import * as fs from 'fs';
import axios from 'axios';

export const useLabelStore = defineStore('labels', {
    state: (): LabelState => ({
        labels: [
            // {id: uuidv4(), name: 'Car'},
            // {id: uuidv4(), name: 'Pedestrian'},
            // {id: uuidv4(), name: 'Cyclist'},
            // {id: uuidv4(), name: 'Traffic Sign'}
        ],
        selectedLabels: []
    }),

    actions: {
        async initialLabels(projectId: number) {
            try {
              const token = localStorage.getItem("token");  // 从本地存储获取用户的 JWT Token
              const response = await axios({
                method: "get", // 使用 GET 请求
                url: `http://127.0.0.1:8080/projects/projects/${projectId}/get_labels`, // 动态传入 projectId
                headers: {
                    Authorization: `Bearer ${token}` // 将 Token 加入请求头
                }
            });

            const fetchedLabels = response.data;
            // 更新 state.labels
            this.labels = fetchedLabels.map((labelName: string) => ({
                id: uuidv4(), // 为每个 label 生成唯一 ID
                name: labelName
            }));
            } catch (error) {
              console.error('Failed to fetch annotations:', error);
              // You can handle errors or show a message to the user here
            }
          },
        addLabel(name: string) {
            const trimmedName = name.trim()
            if (trimmedName && !this.labels.some(label => label.name === trimmedName)) {
                this.labels.push({id: uuidv4(), name: trimmedName})
            }
        },

        removeLabel(labelId: string) {
            const index = this.labels.findIndex(label => label.id === labelId)
            if (index !== -1) {
                this.labels.splice(index, 1)
                this.selectedLabels = this.selectedLabels.filter(label => label.id !== labelId)
            }
        },

        toggleLabel(labelId: string) {
            const index = this.selectedLabels.findIndex(label => label.id === labelId)
            const AnnotationStore = useAnnotationStore();
            const { selectedAnnotation,annotations} = storeToRefs(AnnotationStore); //解构

            if (index === -1) {
                const label = this.labels.find(l => l.id === labelId)
                if (label) this.selectedLabels.push(label)
            } else {
                this.selectedLabels.splice(index, 1)
            }

            if (selectedAnnotation!=null) {
                const index = annotations.value.findIndex(a => a.id === selectedAnnotation.value) 
            if (index !== -1) {
                annotations.value[index].label = this.selectedLabels.map(l => l.name)
            }
            }

        }
    }
})