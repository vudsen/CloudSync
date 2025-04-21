import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    outDir: 'extension/scripts',
    lib: {
      name: 'cs',
      entry: ['./src/scripts/background.ts'],
      formats: ['iife'],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: {
      '@': path.resolve('src/shared'),
    },
  },
})
