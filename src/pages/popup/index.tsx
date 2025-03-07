import '@/dev/iframe-setup.ts'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { NextUIProvider } from '@nextui-org/react'

document.body.innerHTML = '<div id="app"></div>'


const root = createRoot(document.getElementById('app')!)

root.render(
  <NextUIProvider>
    <App/>
  </NextUIProvider>
)
