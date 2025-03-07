import { setupInIframe } from 'cross-iframe-rpc'

window.chrome = setupInIframe<typeof chrome>()
