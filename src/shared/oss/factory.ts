import type { BaseOSSConfig, OSS } from './type.ts'
import { OssType } from './type.ts'
import type { LocalOSSConfig } from './remote/local.ts'
import { LocalOSS } from './remote/local.ts'
import { requireNonNull } from '../util/common.ts'

export const createOSSInstance = (config: BaseOSSConfig) : OSS => {
  if (config.type === OssType.LOCAL) {
    const c = config as Partial<LocalOSSConfig>
    return new LocalOSS(requireNonNull(c.useSync), requireNonNull(c.namespace))
  }
  throw new Error(`Unexpected type ${config.type}`)
}



export type OSSDescription = {
  name: OssType
  description: string
}

export const supportedOSS: OSSDescription[] = [
  {
    name: OssType.BROWSER_ACCOUNT,
    description: 'Save the data to your chrome/edge account, the maximum size is 100KB for each site.',
  },
  {
    name: OssType.LOCAL,
    description: 'Save the data to your browser local.'
  }
]