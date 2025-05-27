import type { OssUiProvider } from '../types.ts'
import { useImperativeHandle, useState } from 'react'
import { registerUiProvider } from '../factory.ts'
import { OssType } from '@/oss/type.ts'
import type { LocalOSSConfig } from '@/oss/remote/local.tsx'
import { createLocalConfig } from '@/oss/remote/local.tsx'
import { Checkbox } from '@heroui/react'

const localOssProvider: OssUiProvider = {
  isSupported() {
    return Promise.resolve(null)
  },
  ConfigFormComponent: (props) => {
    const [configuration, setConfiguration] = useState<LocalOSSConfig>({
      ...createLocalConfig(false),
      ...props.oldEntity
    })

    useImperativeHandle(props.ref, () => ({
      apply: () => {
        return configuration
      }
    }))

    return (
      <div>
        <Checkbox isSelected={configuration.useSync} onValueChange={(value) => setConfiguration({ ...configuration, useSync: value })}>
          Sync Data To Cloud
        </Checkbox>
      </div>
    )
  }
}

registerUiProvider(OssType.ACCOUNT, localOssProvider)
