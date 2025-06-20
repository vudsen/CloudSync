import type { BaseOSSConfig, OssType } from '@/oss/type.ts'
import React, { type Ref, useEffect, useState } from 'react'
import { getUiProvider } from '../../oss-ui/factory.ts'
import OssSelector from '@/component/OssSelector.tsx'
import type { ConfigFormComponentRef, OssUiProvider } from '../../oss-ui/types.ts'

export interface OssProviderFormProps {
  oldEntity?: BaseOSSConfig
  ref?: Ref<ConfigFormComponentRef>
}

const RenderUiProvider: React.FC<{provider: OssUiProvider, ref?: Ref<ConfigFormComponentRef>, oldEntity?: BaseOSSConfig}> = props => {
  const [errorNode, setErrorNode] = useState<React.ReactNode | null>(null)
  const OssForm = props.provider.ConfigFormComponent

  useEffect(() => {
    props.provider.isSupported().then(n => {
      setErrorNode(n)
    })
  }, [props.provider])
  
  return (
    <div>
      { errorNode }
      { errorNode ? null : <OssForm oldEntity={props.oldEntity} ref={props.ref}/>}
    </div>
  )
}

/**
 * Oss 配置表单
 */
const OssProviderForm: React.FC<OssProviderFormProps> = (props) => {
  const [ossType, setOssType] = useState<OssType | undefined>(props.oldEntity?.type)
  const uiProvider = getUiProvider(ossType)

  return (
    <div>
      <OssSelector onChange={setOssType} initialValue={ossType}/>
      {
        uiProvider ? <RenderUiProvider oldEntity={props.oldEntity} provider={uiProvider} ref={props.ref}/> : null
      }
    </div>
  )

}

export default OssProviderForm