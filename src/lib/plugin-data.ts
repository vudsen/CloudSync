import type { BaseOSSConfig } from './oss/type'

const KEY_PAGE_CONFIG_PREFIX = 'page:'

export const readConfig = async (host: string): Promise<BaseOSSConfig | null> => {
  const k = KEY_PAGE_CONFIG_PREFIX + host
  const data = (await chrome.storage.sync.get(k))[k]
  if (!data) {
    return null
  }
  return JSON.parse(data)
}

