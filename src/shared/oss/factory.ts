import type { BaseOSSConfig, OSS, OSSUIProps } from './type'
import { OssType } from './type'
import { LocalOSS } from './remote/local'
import type { LocalOSSConfig } from '@/oss/remote/local'
import { LocalOSSUI } from '@/oss/remote/local'
import { requireNonNull } from '@/util/common'
import type React from 'react'
import getTranslation from '@/util/getTranslation'

export const createOSSInstance = (config: BaseOSSConfig) : OSS => {
  if (config.type === OssType.ACCOUNT) {
    const c = config as Partial<LocalOSSConfig>
    return new LocalOSS(requireNonNull(c.useSync))
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
  }
]

export const resolveUIProvider = (type: OssType): React.FC<OSSUIProps> => {
  if (type === OssType.ACCOUNT) {
    return LocalOSSUI
  }
  throw new Error('Unknown type: ' + type)
}