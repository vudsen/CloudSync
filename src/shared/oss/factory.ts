import type { BaseOSSConfig, OSS, OSSUIProps } from './type.ts'
import { OssType } from './type.ts'
import { LocalOSS } from './remote/local.tsx'
import type { LocalOSSConfig } from '@/oss/remote/local.tsx'
import { LocalOSSUI } from '@/oss/remote/local.tsx'
import { requireNonNull } from '@/util/common.ts'
import type React from 'react'

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
    description: 'Save the data to your browser account.'
  }
]

export const resolveUIProvider = (type: OssType): React.FC<OSSUIProps> => {
  if (type === OssType.ACCOUNT) {
    return LocalOSSUI
  }
  throw new Error('Unknown type: ' + type)
}