import { setLoggerEnabled, setupInIframe } from 'cross-iframe-rpc'

if (process.env.NODE_ENV === 'development') {
  setLoggerEnabled(false)
  window.chrome = setupInIframe<typeof chrome>()
}

