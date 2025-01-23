import type { BaseOSSConfig, OssType } from '@/oss/type.ts'
import React, { useEffect, useState } from 'react'
import { getUiProvider } from '../../oss-ui/factory.ts'
import OssSelector from '@/component/OssSelector.tsx'
import type { OssUiProvider } from '../../oss-ui/types.ts'

export interface OssProviderFormProps {
  updateEntity?: BaseOSSConfig
  onFinish?: (config: BaseOSSConfig) => void
}  

const RenderUiProvider: React.FC<{provider: OssUiProvider}> = props => {
  const [supportedUI, setSupportedUI] = useState<React.ReactNode | null>(null)
  const OssForm = props.provider.ConfigFormComponent
  
  
  useEffect(() => {
    props.provider.isSupported().then(n => {
      setSupportedUI(n)
    })
  }, [props.provider])
  
  return (
    <div>
      { supportedUI }
      { supportedUI ? <OssForm/> : null}
    </div>
  )
  
}

const OssProviderForm: React.FC<OssProviderFormProps> = () => {
  const [ossType, setOssType] = useState<OssType>()
  const uiProvider = getUiProvider(ossType)

  console.log(uiProvider, ossType)
  return (
    <div>
      <OssSelector onChange={setOssType}/>
      {
        uiProvider ? <RenderUiProvider provider={uiProvider} /> : null
      }
    </div>
  )

}

export default OssProviderForm