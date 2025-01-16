import child_process from "node:child_process"

child_process.execSync('vite build --config script/popup/vite-dev.config.ts', {
  stdio: 'inherit',
})

child_process.execSync('vite build --config script/content-script/vite.config.ts', {
  stdio: 'inherit',
})

child_process.execSync('vite build --config script/options/vite-dev.config.ts', {
  stdio: 'inherit',
})

