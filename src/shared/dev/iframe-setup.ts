import { setupInIframe } from 'cross-iframe-rpc'

export default function iframeSetup() {
  window.chrome = setupInIframe<typeof chrome>()
}