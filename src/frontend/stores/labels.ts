import {defineStore,storeToRefs} from 'pinia'
import type {LabelState} from './types'
import { useAnnotationStore } from './annotation'
import {v4 as uuidv4} from 'uuid'

export const useLabelStore = defineStore('labels', {
    state: (): LabelState => ({
        labels: [
            {id: uuidv4(), name: 'Car'},
            {id: uuidv4(), name: 'Pedestrian'},
            {id: uuidv4(), name: 'Cyclist'},
            {id: uuidv4(), name: 'Traffic Sign'}
        ],
        selectedLabels: []
    }),

    actions: {
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