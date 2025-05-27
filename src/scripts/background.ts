import type { MessageBase } from '@/util/extension.ts'
import { isCorrespondMessage, executeScript } from '@/util/extension.ts'
import { sendResponseMessage } from '@/util/extension.ts'
import type { StorageItem } from '@/store/oss/ossSlice.ts'

function loadLocalStorageData(): Record<string, string> {
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
  if (process.env.NODE_ENV === 'development') {
    console.log(data)
  }
  return data
}

function localStorageSetItems(items: StorageItem[]) {
  window.addEventListener('beforeunload', () => {
    localStorage.clear()
    for (const item of items) {
      localStorage.setItem(item.name, item.data)
    }
  })
  if (process.env.NODE_ENV === 'development') {
    console.log(items)
  }
  // idk why `window.location.reload()` can't make `beforeunload` work
  alert('Localstorage sync request is done. Refresh the page to make it active.')
}

async function actualListener(obj: MessageBase) {
  if (isCorrespondMessage(obj, 'ReadLocalStorage')) {
    const data: Record<string, string> = await executeScript(obj.data.tabId, loadLocalStorageData, [])
    sendResponseMessage('ReadLocalStorageResponse', data).catch(e => {
      console.log(e)
    })
  } else if (isCorrespondMessage(obj, 'SynchronousStorage')) {
    if (obj.data.items.length === 0) {
      return
    }
    executeScript(obj.data.tabId, localStorageSetItems, [obj.data.items]).catch(e => {
      console.log(e)
    })
  }
}

chrome.runtime.onMessage.addListener(message => {
  actualListener(message as MessageBase).catch(e => {
    console.error(e)
  })
  return undefined
})

if (process.env.NODE_ENV === 'development') {
  console.log('Script Loaded.')
}
