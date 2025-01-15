import child_process from "node:child_process"
import * as fs from "node:fs"


child_process.execSync('vite build --config script/content-script/vite.config.ts', {
  stdio: 'inherit',
})

child_process.execSync('vite build --config script/popup/vite.config.ts', {
  stdio: 'inherit',
})

