import type { MessageBase } from '@/util/extension.ts'
import { sendResponseMessage, typedRequestListenerKey } from '@/util/extension.ts'
import type { StorageItem } from '@/store/oss/ossSlice.ts'


chrome.runtime.onMessage.addListener(message => {
  const obj = JSON.parse(message) as MessageBase
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
    sendResponseMessage('ReadLocalStorageResponse', data).catch(e => {
      console.log(e)
    })
  }
  if (obj.type === typedRequestListenerKey('SynchronousStorage')) {
    const items = obj.data as StorageItem[]
    if (items.length <= 0) {
      return
    }
    window.addEventListener('beforeunload', () => {
      localStorage.clear()
      for (const item of items) {
        localStorage.setItem(item.name, item.data)
      }
    })
    const userResponse = confirm('Localstorage sync request was sent. Refresh the page to make it active now?')
    if (userResponse) {
      window.location.reload()
    }
  }
  return undefined
})