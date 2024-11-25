import {defineStore} from 'pinia'
import type {ToolState} from './types'

export const useToolStore = defineStore('tools', {
    state: (): ToolState => ({
        selectedTool: null,
        tools: [
            {id: 'box', name: 'Bounding Box', icon: 'mdi-cube-outline', active: false},
            {id: 'polygon', name: 'Polygon', icon: 'mdi-vector-polygon', active: false},
            {id: 'drag', name: 'Drag', icon: 'mdi-drag', active: false},
            {id: 'delete', name: 'Delete', icon: 'mdi-delete', active: false},
            //新增文件选择tool
            {id: 'file', name: 'File', icon: 'mdi-folder-outline', active: false}
        ]
    }),

    actions: {
        selectTool(toolId: string) {
            if (this.selectedTool === toolId) {
                // 如果点击的是当前选中的工具，则取消选中
                this.selectedTool = null
                this.tools.forEach(tool => {
                    tool.active = false
                })
            } else {
                // 否则选中新的工具
                this.selectedTool = toolId
                this.tools.forEach(tool => {
                    tool.active = tool.id === toolId
                })
            }
        }
    },

    getters: {
        currentTool: (state) => state.tools.find(tool => tool.id === state.selectedTool)
    }
})