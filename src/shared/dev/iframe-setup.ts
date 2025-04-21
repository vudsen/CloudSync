import { setLoggerEnabled, setupInIframe } from 'cross-iframe-rpc'

setLoggerEnabled(false)
window.chrome = setupInIframe<typeof chrome>()
