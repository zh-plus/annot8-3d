/// <reference types="vitest" />
/// <reference types="vite/client" />

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src/frontend', import.meta.url))
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'], // We'll create this
        include: ['**/*.{test,spec}.{js,ts,jsx,tsx}']
    }
})