import * as fs from 'node:fs'
import {request} from "node:https"
import path from "node:path"

const SCRIPT_DIR = 'dist/lib'
fs.mkdirSync(SCRIPT_DIR, { recursive: true })

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    request(url).pipe(fs.createWriteStream(path.join(SCRIPT_DIR, filename))).on('close', function(err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const mode = process.env.NODE_ENV ?? 'development'

if (!fs.existsSync('dist/manifest.json')) {
  console.log('cp')
  fs.cpSync('script/manifest-dev.json', 'dist/manifest.json')
}

Promise.all([
  downloadFile(`https://cdn.jsdelivr.net/npm/react/cjs/react.${mode}.min.js`, 'react.min.js'),
  downloadFile(`https://cdn.jsdelivr.net/npm/react-dom/index.min.js`, 'react-dom.min.js'),
]).catch(e => {
  console.error(e)
})
