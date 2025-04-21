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

  private readonly KEY_VALUE_PREFIX
  
  private readonly config: LocalOSSConfig
  
  constructor(useSync: boolean) {
    this.storage = useSync ? chrome.storage.sync : chrome.storage.local
    this.KEY_VALUE_PREFIX = 'local:key:'
    this.config = createLocalConfig(useSync)
  }

  usedBytes(): Promise<number> {
    return this.storage.getBytesInUse()
  }


  async update(name: string, data: string): Promise<void> {
    await this.storage.set({ [this.KEY_VALUE_PREFIX + name]: data })
  }
  async delete(name: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    await this.storage.remove(k)
  }
  async query(name: string): Promise<string | undefined> {
    const o = await this.storage.get(this.KEY_VALUE_PREFIX + name)
    return o[this.KEY_VALUE_PREFIX + name]
  }
  async insert(name: string, data: string): Promise<void> {
    const k = this.KEY_VALUE_PREFIX + name
    await this.storage.set({
      [k]: data,
    })
  }
  getConfig(): BaseOSSConfig {
    return this.config
  }
  
}