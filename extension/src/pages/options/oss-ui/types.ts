import type { BaseOSSConfig } from '@/oss/type.ts'
import type { Ref } from 'react'
import type React from 'react'

export interface OssConfigProps {
  oldEntity?: BaseOSSConfig
  onFinish?: (config: BaseOSSConfig) => void
  ref?: Ref<ConfigFormComponentRef>
}

export interface ConfigFormComponentRef {
  /**
   * 获取表单数据，返回空表示校验失败
   */
  apply: () => Promise<BaseOSSConfig | undefined>
}

export interface OssUiProvider {
  /**
   * 是否支持该 OSS. 如果支持，返回 null，否则返回一个组件渲染不支持的原因.
   */
  isSupported(): Promise<React.ReactNode | null>
  /**
   * 配置表单
   */
  ConfigFormComponent: React.FC<OssConfigProps>

}