import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: '/popup',
  root: path.resolve('src/pages/popup'),
  build: {
    sourcemap: true,
    outDir: path.resolve('dist/popup'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve('src/pages/popup/index.html'),
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src/lib'),
    },
  },
})
