import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer()
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
      external: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        'react',
        'react-dom',
        'react-dom/client',
      ],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src/lib'),
    },
  },
})
