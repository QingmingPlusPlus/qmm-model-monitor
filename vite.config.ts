import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'QMM',
            fileName: (format) => `qmm.${format}.min.js`
        }
    },
    server: {
        port: 4810,
        host: '0.0.0.0'
    }
})