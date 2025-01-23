import type { BaseOSSConfig } from '@/oss/type.ts'
import type React from 'react'

export interface OssConfigProps {
  updateEntity?: BaseOSSConfig
  onFinish?: (config: BaseOSSConfig) => void
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