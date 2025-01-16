import { defineConfig } from 'vite'
import renameHtmlPlugin from '../rename-html-plugin'


// https://vite.dev/config/
export default defineConfig({
  base: '/popup',
  plugins: [renameHtmlPlugin('popup-dev.html', 'popup.html')],
  build: {
    rollupOptions: {
      input: 'popup-dev.html',
      output: {
        dir: 'extension/popup',
      }
    },
  },
})