import type { OssUiProvider } from '../types.ts'
import React, { useEffect } from 'react'
import { Button } from '@nextui-org/react'
import { accessProperty } from 'cross-iframe-rpc'
import { registerUiProvider } from '../factory.ts'
import { OssType } from '@/oss/type.ts'

type Delegate = {
  isSupported(): Promise<React.ReactNode | null>
  getUsedBytes: () => Promise<number>
}


const ossProviderTemplate = (delegate: Delegate): OssUiProvider => {
  return {
    isSupported: delegate.isSupported,
    ConfigFormComponent: () => {
      const [usedBytes, setUsedBytes] = React.useState<number>(-1)

      useEffect(() => {
        delegate.getUsedBytes().then(r => {
          setUsedBytes(r)
        })
      }, [])

      return (
        <div>
          Used bytes: {usedBytes}
          <Button color="primary">Confirm</Button>
        </div>
      )
    }
  }
}

const localStorageProvider = ossProviderTemplate({
  isSupported(): Promise<React.ReactNode | null> {
    return Promise.resolve(null)
  },
  getUsedBytes(): Promise<number> {
    return chrome.storage.local.getBytesInUse()
  }
})

const remoteStorageProvider = ossProviderTemplate({
  async isSupported(): Promise<React.ReactNode | null> {
    console.log('bbb')
    const sync = await accessProperty(chrome.storage.sync)
    console.log('sss')
    if (!sync) {
      return (
        <div>Not login</div>
      )
    }
    return null
  },
  getUsedBytes(): Promise<number> {
    return chrome.storage.sync.getBytesInUse()
  }
})

registerUiProvider(OssType.LOCAL, localStorageProvider)
registerUiProvider(OssType.BROWSER_ACCOUNT, remoteStorageProvider)
