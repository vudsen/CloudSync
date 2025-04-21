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

export enum OssType {
  LOCAL = 'Local Account',
}

export type BaseOSSConfig = {
  type: OssType
  id: string
  name: string
}