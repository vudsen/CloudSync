import type { MessagePoster } from 'cross-iframe-rpc'
import { createBridePeerClientWithTypeOnly } from 'cross-iframe-rpc'

export default function iframeSetup() {
  if (process.env.NODE_ENV === 'development') {
    const poster: MessagePoster = {
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
    window.chrome = createBridePeerClientWithTypeOnly<typeof chrome>({
      poster
    })
  }

}