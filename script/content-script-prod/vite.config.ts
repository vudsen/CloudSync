import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/content-scripts',
    lib: {
      name: 'cs',
      entry: path.resolve('src/scripts/content-script.ts'),
      formats: ['iife'],
      fileName: 'content-script',
    },
    rollupOptions: {
      output: {
        name: 'dist/content-script.js'
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('src/lib'),
    },
  },
})
