import { setLoggerEnabled, setupInMainWindow } from 'cross-iframe-rpc'

const iframe = document.getElementById('iframe') as HTMLIFrameElement

setupInMainWindow({
  iframe,
  delegateTarget: chrome
})
setLoggerEnabled(true)
