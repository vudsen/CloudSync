import type { PluginOption } from 'vite'

const renameHtmlPlugin = (oldName: string,newFilename: string): PluginOption => {
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

export default renameHtmlPlugin