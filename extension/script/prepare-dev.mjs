import child_process from "node:child_process"

child_process.execSync('vite build --config script/vite/pages-prepare.config.ts', {
  stdio: 'inherit',
})

child_process.execSync('vite build --config script/vite/scripts.config.ts', {
  stdio: 'inherit',
})


