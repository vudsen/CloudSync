import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'

const renameIndexPlugin = (oldName: string,newFilename: string): PluginOption => {
  if (!newFilename) return

  return {
    name: 'renameIndex',
    enforce: 'post',
    generateBundle(_, bundle) {
      const indexHtml = bundle[oldName]
      indexHtml.fileName = newFilename
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/popup',
  plugins: [renameIndexPlugin('popup-dev.html', 'popup.html')],
  build: {
    rollupOptions: {
      input: 'popup-dev.html',
      output: {
        dir: 'extension/popup',
      }
    },
  },
})