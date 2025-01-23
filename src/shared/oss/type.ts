
export type OSSItem = {
  name: string
}

export interface OSS {
  listKeys(): Promise<string[]>
  update(name: string, data: string): Promise<void>
  delete(name: string): Promise<void>
  query(name: string): Promise<string>
  insert(name: string, data: string): Promise<void>
  getConfig(): BaseOSSConfig
}

export enum OssType {
  BROWSER_ACCOUNT = 'Browser Account',
  LOCAL = 'Local Account',
}

export type BaseOSSConfig = {
  type: OssType
}