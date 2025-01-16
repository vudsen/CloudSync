interface RequestMessage {
  ReadLocalStorage: void
}

interface ResponseMessage {
  ReadLocalStorageResponse: Record<string, string>
}

type SendMessageFuncArgs<K extends keyof RequestMessage> = void extends K ? [K] : [K, RequestMessage[K]]

export type MessageBase = {
  type: string
  data: unknown
}



// for type safety
export const typedRequestListenerKey = <K extends keyof RequestMessage>(k: K): K => {
  return k
}
export const sendResponseMessage = <K extends keyof ResponseMessage>(k: K, data: ResponseMessage[K]): Promise<void> => {
  const msg: MessageBase = {
    type: k,
    data: data
  }
  return chrome.runtime.sendMessage(JSON.stringify(msg))
}

export const createMessage =
  <T extends keyof RequestMessage>(...args: SendMessageFuncArgs<T>) => {
    const data: MessageBase = {
      type: args[0],
      data: args[1],
    }
    return JSON.stringify(data)
  }

export type MessageListener = Parameters<typeof chrome.runtime.onMessage.addListener>[0]

export const sendMsgToTabAndWaitForResponse = async <T extends keyof RequestMessage, R extends keyof ResponseMessage>
(tabId: number, expectedResponse: R, ...args: SendMessageFuncArgs<T>): Promise<ResponseMessage[R]> => {
  const p = new Promise<ResponseMessage[R]>((resolve) => {
    const cb: MessageListener = message => {
      const msg = JSON.parse(message)
      if (msg.type === expectedResponse) {
        chrome.runtime.onMessage.removeListener(cb)
        resolve(msg.data)
      }
      return undefined
    }
    chrome.runtime.onMessage.addListener(cb)
  })

  const data: MessageBase = {
    type: args[0],
    data: args[1],
  }
  await chrome.tabs.sendMessage(tabId, JSON.stringify(data))
  return p
}