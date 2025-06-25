import type { OssUiProvider } from './types.ts'
import type { OssType } from '@/oss/type.ts'


const uiProviderMap = new Map<OssType, OssUiProvider>()


export function registerUiProvider(ossType: OssType, provider: OssUiProvider) {
  uiProviderMap.set(ossType, provider)
}

export function getUiProvider(ossType?: OssType): OssUiProvider | undefined {
  if (!ossType) {
    return
  }
  return uiProviderMap.get(ossType)
}