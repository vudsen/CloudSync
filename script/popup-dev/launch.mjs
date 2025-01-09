import * as fs from "node:fs"
import child_process from "node:child_process"



child_process.execSync('vite build --config script/popup-dev/vite.config.ts --watch', {
  stdio: 'inherit',
})
