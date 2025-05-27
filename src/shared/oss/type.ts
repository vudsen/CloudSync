import type React from 'react'

export interface OSS {
  update(name: string, data: string): Promise<void>
  delete(name: string): Promise<void>
  query(name: string): Promise<string | undefined>
  insert(name: string, data: string): Promise<void>
  getConfig(): BaseOSSConfig
  /**
   * 已使用的空间
   */
  usedBytes(): Promise<number>
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
}

export type BaseOSSConfig = {
  type: OssType
  id: string
  name: string
}