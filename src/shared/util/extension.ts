import type { StorageItem } from '@/store/oss/ossSlice.ts'

interface RequestMessage {
  ReadLocalStorage: {
    tabId: number
  },
  SynchronousStorage: {
    tabId: number
    items: StorageItem[]
  },
}

interface ResponseMessage {
  /**
   * 当返回 string 时，表示读取 localStorage 时发生了错误
   */
  ReadLocalStorageResponse: Record<string, string> | string
}

type SendMessageFuncArgs<K extends keyof RequestMessage> = void extends K ? [K] : [K, RequestMessage[K]]

export type MessageBase<T = unknown> = {
  type: string
  data: T
}

/**
 * 尝试将消息转换为指定类型
 * @return 如果转换成功，返回转换后的消息；否则返回 undefined
 */
export const isCorrespondMessage =
  <K extends keyof RequestMessage>(msg: MessageBase, expected: K): msg is MessageBase<RequestMessage[K]> => {
    return msg.type === expected
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any

/**
 * 执行脚本
 */
export async function executeScript<Fun extends AnyFunction>(tabId: number, func: Fun, args: Parameters<Fun>): Promise<ReturnType<Fun>> {
  const results = await chrome.scripting.executeScript({
    target: {
      tabId,
      allFrames: false
    },
    func,
    args
  })
  console.log(results)
  const holder = results[0] as { result: ReturnType<Fun> }
  return holder.result
}


export const sendResponseMessage = <K extends keyof ResponseMessage>(k: K, data: ResponseMessage[K]): Promise<void> => {
  const msg: MessageBase = {
    type: k,
    data: data
  }
  return chrome.runtime.sendMessage(JSON.stringify(msg))
}

export const sendMessageToBackground =
  <T extends keyof RequestMessage>(...args: SendMessageFuncArgs<T>) => {
    const data: MessageBase = {
      type: args[0],
      data: args[1],
    }
    return chrome.runtime.sendMessage(data)
  }

export type MessageListener = Parameters<typeof chrome.runtime.onMessage.addListener>[0]

export const sendMsgToTabAndWaitForResponse = async <T extends keyof RequestMessage, R extends keyof ResponseMessage>
(expectedResponse: R, ...args: SendMessageFuncArgs<T>): Promise<ResponseMessage[R]> => {
  const p = new Promise<ResponseMessage[R]>((resolve) => {
    const cb: MessageListener = message => {
      console.log(message)
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
  await chrome.runtime.sendMessage(data)
  return p
}