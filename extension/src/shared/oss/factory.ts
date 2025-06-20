import type { BaseOSSConfig, OSS } from './type'
import { OssType } from './type'
import { LocalOSS } from './remote/local'
import type { LocalOSSConfig } from '@/oss/remote/local'
import { requireNonNull } from '@/util/common'
import getTranslation from '@/util/getTranslation'
import type { CloudflareOSSConfig } from '@/oss/remote/cloudflare.tsx'
import { CloudflareOSS } from '@/oss/remote/cloudflare.tsx'

export const createOSSInstance = (config: BaseOSSConfig) : OSS => {
  if (config.type === OssType.ACCOUNT) {
    const c = config as Partial<LocalOSSConfig>
    return new LocalOSS(requireNonNull(c.useSync))
  } else if (config.type === OssType.CLOUDFLARE_KV) {
    const c = config as CloudflareOSSConfig
    return new CloudflareOSS(c)
  }
  throw new Error(`Unexpected type ${config.type}`)
}

export type OSSDescription = {
  name: OssType
  description: string
}

export const supportedOSS: OSSDescription[] = [
  {
    name: OssType.ACCOUNT,
    description: getTranslation('localOssDescription')
  },
  {
    name: OssType.CLOUDFLARE_KV,
    description: getTranslation('cloudflareDescription')
  }
]
