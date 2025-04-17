import type { BaseOSSConfig, OSS } from '../type.ts'
import { OssType } from '../type.ts'

const CONSTANT_ID = '_$local' 

export type LocalOSSConfig = BaseOSSConfig & {
  useSync: boolean
}

export function createLocalConfig(useSync: boolean): LocalOSSConfig {
  return {
    useSync,
    id: CONSTANT_ID,
    name: 'Local',
    type: OssType.LOCAL
  }
}

export class LocalOSS implements OSS {
  
  private storage: chrome.storage.StorageArea

  /**
   * 存储所 namespace 下所有的键
   * @private
   */
  private readonly KEY_KEYS_INDICATOR
  
  private readonly KEY_VALUE_PREFIX
  
  private readonly config: LocalOSSConfig
  
  constructor(useSync: boolean) {
    this.storage = useSync ? chrome.storage.sync : chrome.storage.local
    this.KEY_KEYS_INDICATOR = 'local:keys'
    this.KEY_VALUE_PREFIX = 'local:key:'
    this.config = createLocalConfig(useSync)
  }

  usedBytes(): Promise<number> {
    return this.storage.getBytesInUse()
  }

  private async readKeys(): Promise<string[]> {
    const o = await this.storage.get(this.KEY_KEYS_INDICATOR)
    const keys = o[this.KEY_KEYS_INDICATOR] as (string[] | undefined)
    return keys ?? []
  }

  listKeys(): Promise<string[]> {
    return this.readKeys()
  }
  async update(name: string, data: string): Promise<void> {
    await this.storage.set({ [this.KEY_VALUE_PREFIX + name]: data })
    const keys = await this.readKeys()

    keys.push(this.KEY_VALUE_PREFIX + name)
    await this.storage.set({
      [this.KEY_KEYS_INDICATOR]: JSON.stringify(keys),
    })
  }
  async delete(name: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    await this.storage.remove(k)
    const keys = await this.readKeys()

    const i = keys.findIndex(v => v === k)
    if (i > -1) {
      keys.splice(i, 1)
    }
    await this.storage.set({
      [this.KEY_KEYS_INDICATOR]: JSON.stringify(keys),
    })
  }
  async query(name: string): Promise<string | undefined> {
    const o = await this.storage.get(this.KEY_VALUE_PREFIX + name)
    return o[this.KEY_VALUE_PREFIX + name]
  }
  async insert(name: string, data: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    const keys = await this.listKeys()
    keys.push(k)
    await this.storage.set({
      [k]: data,
      [this.KEY_KEYS_INDICATOR]: keys
    })
  }
  getConfig(): BaseOSSConfig {
    return this.config
  }
  
}