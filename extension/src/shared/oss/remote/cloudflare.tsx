import type { BaseOSSConfig, OSS } from '@/oss/type.ts'
import { OssType } from '@/oss/type.ts'

type MyCloudflareConfig = {
  apiToken: string
  namespaceId: string
  accountId: string
}

export type CloudflareOSSConfig = BaseOSSConfig & MyCloudflareConfig

type Constructor = MyCloudflareConfig & {
  id: string
}

export function createCloudflareConfig(config: Constructor): CloudflareOSSConfig {
  return {
    name: 'Cloudflare KV',
    id: config.id,
    type: OssType.CLOUDFLARE_KV,
    accountId: config.accountId,
    apiToken: config.apiToken,
    namespaceId: config.namespaceId,
  }
}

export class CloudflareOSS implements OSS {

  private config: CloudflareOSSConfig

  constructor(cons: Constructor) {
    this.config = createCloudflareConfig(cons)
  }

  private checkResponse(response: Response): Promise<void> {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve()
    }
    return Promise.reject(response.text())
  }

  async delete(name: string): Promise<void> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/storage/kv/namespaces/${this.config.namespaceId}/values/${name}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
      }
    })
    return this.checkResponse(response)
  }

  getConfig(): BaseOSSConfig {
    return this.config
  }

  async insert(name: string, data: string): Promise<void> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/storage/kv/namespaces/${this.config.namespaceId}/values/${name}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: data
    })
    return this.checkResponse(response)
  }

  isUnique(): boolean {
    return false
  }

  async query(name: string): Promise<string | undefined> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/storage/kv/namespaces/${this.config.namespaceId}/values/${name}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
      }
    })
    if (!response.ok) {
      return Promise.reject(response.text())
    }
    return response.text()
  }

  update(name: string, data: string): Promise<void> {
    return this.insert(name, data)
  }

  usedBytes(): Promise<number> {
    return Promise.resolve(-1)
  }
  
}