import {defineStore} from 'pinia'
import type {LabelState} from './types'
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
            if (index === -1) {
                const label = this.labels.find(l => l.id === labelId)
                if (label) this.selectedLabels.push(label)
            } else {
                this.selectedLabels.splice(index, 1)
            }
        }
    }
})