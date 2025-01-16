import type { BaseOSSConfig, OSS } from '@/oss/type'
import type { LocalOSSConfig } from '@/oss/remote/local'
import { LocalOSS } from '@/oss/remote/local'
import { requireNonNull } from '@/util/common'

export const createOSSInstance = (config: BaseOSSConfig) : OSS => {
  if (config.type === 'local') {
    const c = config as Partial<LocalOSSConfig>
    return new LocalOSS(requireNonNull(c.useSync), requireNonNull(c.namespace))
  }
  throw new Error(`Unexpected type ${config.type}`)
}

export type OSSDescription = {
  name: string
  description: string
}

export const supportedOSS: OSSDescription[] = [
  {
    name: 'Browser Account',
    description: 'Save the data to your chrome/edge account, the maximum size is 100KB for each site.',
  }
]