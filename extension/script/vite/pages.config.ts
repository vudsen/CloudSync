import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/pages',
  server: {
    port: 17000,
    strictPort: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: ['options.html', 'popup.html'],
      output: {
        dir: 'release/pages',
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src/shared'),
    },
  },
})
