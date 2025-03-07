import type { OssUiProvider } from '../types.ts'
import { useImperativeHandle, useState } from 'react'
import { registerUiProvider } from '../factory.ts'
import { OssType } from '@/oss/type.ts'
import { LocalOSSConfig } from '@/oss/remote/local.ts'
import { Checkbox } from '@nextui-org/react'

const localOssProvider: OssUiProvider = {
  isSupported() {
    return Promise.resolve(null)
  },
  ConfigFormComponent: (props) => {
    const [useSync, setUseSync] = useState(false)

    useImperativeHandle(props.ref, () => ({
      apply: () => {
        return new LocalOSSConfig(useSync)
      }
    }))

    return (
      <div>
        <Checkbox isSelected={useSync} onValueChange={setUseSync}>
          Sync Data To Cloud
        </Checkbox>
      </div>
    )
  }
}

registerUiProvider(OssType.LOCAL, localOssProvider)
