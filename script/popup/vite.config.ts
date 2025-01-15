import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: '/popup',
  server: {
    port: 17000,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: 'popup.html',
      output: {
        dir: 'extension/popup',
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src/lib'),
    },
  },
})
