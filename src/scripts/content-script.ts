import { sendResponseMessage, typedRequestListenerKey } from '@/message'

console.log('Script loaded.')

chrome.runtime.onMessage.addListener(message => {
  const obj = JSON.parse(message)
  console.log(message)
  if (obj.type === typedRequestListenerKey('ReadLocalStorage')) {
    const data: Record<string, string> = {}

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k == null) {
        continue
      }
      const v = localStorage.getItem(k)
      if (v) {
        data[k] = v
      }
    }
    sendResponseMessage('ReadLocalStorageResponse', data)
  }
  return undefined
})