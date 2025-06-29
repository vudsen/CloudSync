import type React from 'react'

export interface OSS {
  update(name: string, data: string): Promise<void>
  delete(name: string): Promise<void>
  query(name: string): Promise<string | undefined>
  insert(name: string, data: string): Promise<void>
  getConfig(): BaseOSSConfig
  /**
   * 已使用的空间
   * @return {Promise<number>} 已经使用的大小(字节)，如果不支持查询，返回负数
   */
  usedBytes(): Promise<number>
  /**
   * 此类配置是否只能创建一个
   */
  isUnique(): boolean
}

export interface OSSUIRef {
  /**
   * 检查所有表达，如果没有错误返回对应的配置，否则返回空
   */
  apply(): BaseOSSConfig | undefined
}

export interface OSSUIProps {
  oldConfig?: BaseOSSConfig
  ref?: React.RefObject<OSSUIRef>
}

export interface OSSUIProvider {
  createUI(): React.FC<OSSUIProps>
}

export enum OssType {
  ACCOUNT = 'Local Account',
  CLOUDFLARE_KV = 'Cloudflare KV',
}

export type BaseOSSConfig = {
  type: OssType
  id: string
  name: string
}