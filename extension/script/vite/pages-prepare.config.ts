import renameHtmlPlugin from '../vite/rename-html-plugin'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/pages',
  plugins: [
    renameHtmlPlugin([
      {
        oldName: 'options-dev.html',
        newName: 'options.html'
      },
      {
        oldName: 'popup-dev.html',
        newName: 'popup.html'
      }
    ])
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: ['options-dev.html', 'popup-dev.html'],
      output: {
        dir: 'release/pages',
      }
    },
  },
})