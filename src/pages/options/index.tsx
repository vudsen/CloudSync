import App from './App.tsx'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { createBridgePeerClient } from 'cross-iframe-rpc'
import './global.css'

document.body.innerHTML = '<div id="app"></div>'

if (process.env.NODE_ENV === 'development') {
  window.chrome = createBridgePeerClient({
    target: chrome,
    poster: {
      postMessage(str) {
        window.parent.window.postMessage(str, '*')
      },
      addEventListener(name, callback) {
        window.addEventListener(name, (evt) => {
          callback(evt)
        })
      },
      removeEventListener(name, callback) {
        window.removeEventListener(name, callback)
      }
    }
  })
}

const root = createRoot(document.getElementById('app')!)

root.render(
  <NextUIProvider>
    <App/>
  </NextUIProvider>
)
