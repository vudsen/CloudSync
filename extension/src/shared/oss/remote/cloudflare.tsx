import type { BaseOSSConfig, OSS } from '@/oss/type.ts'
import { OssType } from '@/oss/type.ts'

type MyCloudflareConfig = {
  endpoint: string
  token: string
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
    endpoint: config.endpoint,
    token: config.token,
  }
}

export class CloudflareOSS implements OSS {

  private config: CloudflareOSSConfig

  constructor(cons: Constructor) {
    this.config = createCloudflareConfig(cons)
  }

  private async doRequest(method: string, key: string, body?: string): Promise<string> {
    const response = await fetch(`${this.config.endpoint}?key=${key}`, {
      headers: {
        'Authorization': this.config.token,
      },
      body,
      method
    })
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.text())
    }
    return Promise.reject(new Error(`body: ${await response.text()}, statusCode: ${response.status}`))
  }

  async delete(name: string): Promise<void> {
    await this.doRequest('DELETE', name)
  }

  getConfig(): BaseOSSConfig {
    return this.config
  }

  async insert(name: string, data: string): Promise<void> {
    await this.doRequest('PUT', name, data)
  }

  isUnique(): boolean {
    return false
  }

  async query(name: string): Promise<string | undefined> {
    return this.doRequest('GET', name)
  }

  update(name: string, data: string): Promise<void> {
    return this.insert(name, data)
  }

  usedBytes(): Promise<number> {
    return Promise.resolve(-1)
  }
  
}