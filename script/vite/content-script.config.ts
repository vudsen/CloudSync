import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'extension/content-scripts',
    lib: {
      name: 'cs',
      entry: './src/scripts/content-script.ts',
      formats: ['iife'],
      fileName: 'index',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('src/shared'),
    },
  },
})
