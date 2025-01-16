import renameHtmlPlugin from '../rename-html-plugin'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  base: '/options',
  plugins: [renameHtmlPlugin('options-dev.html', 'options.html')],
  build: {
    rollupOptions: {
      input: 'options-dev.html',
      output: {
        dir: 'extension/options',
      }
    },
  },
})