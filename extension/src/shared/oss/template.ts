import type { BaseOSSConfig } from '@/oss/type.ts'
import type { StorageItem } from '@/store/oss/ossSlice'
import { createOSSInstance } from '@/oss/factory.ts'

interface OssTemplate {
  queryStorages(remoteKey: string): Promise<StorageItem[]>
}

const createOssTemplate = (ossConfig: BaseOSSConfig): OssTemplate => {
  const oss = createOSSInstance(ossConfig)
  return {
    async queryStorages(remoteKey: string): Promise<StorageItem[]> {
      const result = await oss.query(remoteKey)
      if (result) {
        return JSON.parse(result)
      }
      return []
    }
  }
}

export default createOssTemplate