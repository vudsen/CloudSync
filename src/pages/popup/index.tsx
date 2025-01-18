import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { NextUIProvider } from '@nextui-org/react'
import iframeSetup from '@/dev/iframe-setup.ts'

document.body.innerHTML = '<div id="app"></div>'

iframeSetup()

const root = createRoot(document.getElementById('app')!)

root.render(
  <NextUIProvider>
    <App/>
  </NextUIProvider>
)
