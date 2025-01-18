/**
 * 存储
 */
import type { BaseOSSConfig } from '../oss/type.ts'
import type { OSSDescription } from '../oss/factory.ts'

const KEY_PAGE_CONFIG_PREFIX = 'page:'
// const KEY_ALL_CONFIGS_PREFIX = 'page:all'

export const readPageConfig = async (host: string): Promise<BaseOSSConfig | null> => {
  const k = KEY_PAGE_CONFIG_PREFIX + host
  const data = (await chrome.storage.sync.get(k))[k]
  if (!data) {
    return null
  }
  return JSON.parse(data)
}

export type StorageItem = {
  name: string
  data: string
}

export const savePageConfig = async (host: string, items: StorageItem[], oss: OSSDescription): Promise<void> => {
  // page:<host>:<timestamp>
  // const itemKey = KEY_PAGE_CONFIG_PREFIX + host + ':' + Date.now()
  console.log(host, items, oss)
  throw new Error('TODO')
}