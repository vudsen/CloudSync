import type { OssUiProvider } from '../types.ts'
import { useImperativeHandle, useState } from 'react'
import { registerUiProvider } from '../factory.ts'
import { OssType } from '@/oss/type.ts'
import type { LocalOSSConfig } from '@/oss/remote/local.tsx'
import { createLocalConfig } from '@/oss/remote/local.tsx'
import { Alert, Checkbox } from '@heroui/react'
import Translation from '@/component/Translation.tsx'

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
      <div className="my-3">
        <Checkbox isSelected={configuration.useSync} onValueChange={(value) => setConfiguration({ ...configuration, useSync: value })}>
          <Translation i18nKey="syncToCloud"/>
        </Checkbox>
        {
          configuration.useSync ? (
            <Alert color="warning">
              <Translation i18nKey="syncAccountWarn"/>
            </Alert>
          ) : null
        }
      </div>
    )
  }
}

registerUiProvider(OssType.ACCOUNT, localOssProvider)
