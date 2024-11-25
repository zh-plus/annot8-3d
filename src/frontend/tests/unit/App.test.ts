import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {vuetify} from '../setup'
import App from '@/App.vue'

describe('App', () => {
    it('renders properly', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [vuetify],
            },
        })
        expect(wrapper.exists()).toBe(true)
    })
})