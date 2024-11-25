import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {createVuetify} from 'vuetify'
import {createPinia} from 'pinia'
import ToolBar from '@/components/toolbar/ToolBar.vue'

describe('ToolBar', () => {
    const vuetify = createVuetify()
    const pinia = createPinia()

    it('renders all tools', () => {
        const wrapper = mount(ToolBar, {
            global: {
                plugins: [vuetify, pinia],
            },
        })
        expect(wrapper.findAll('.v-list-item')).toHaveLength(4)
    })
})