import {defineStore} from 'pinia'
import type {AnnotationState} from './types'
import type {Annotation} from '@/types'
import {v4 as uuidv4} from 'uuid'

export const useAnnotationStore = defineStore('annotation', {
    state: (): AnnotationState => ({
        annotations: [],
        selectedAnnotation: null,
        isDrawing: false
    }),
    actions: {
        addAnnotation(annotation: Omit<Annotation, 'id'>) {
            this.annotations.push({
                id: uuidv4(),
                ...annotation
            })
        },

        removeAnnotation(id: string) {
            const index = this.annotations.findIndex(a => a.id === id)
            if (index !== -1) {
                this.annotations.splice(index, 1)
                if (this.selectedAnnotation === id) {
                    this.selectedAnnotation = null
                }
            }
        },

        setDrawingState(isDrawing: boolean) {
            this.isDrawing = isDrawing
        },

        selectAnnotation(id: string | null) {
            this.selectedAnnotation = id
        },
    }
})