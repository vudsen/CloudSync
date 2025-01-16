import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: '/options',
  server: {
    port: 17001,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: 'options.html',
      output: {
        dir: 'extension/options',
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src/lib'),
    },
  },
})
