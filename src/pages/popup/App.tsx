import { useEffect, useState } from 'react'
import { readPageConfig } from '@/core/data.ts'
import type { OSS } from '../../shared/oss/type'
import { createOSSInstance } from '../../shared/oss/factory'
import PopupContext, { CONTAINER_HEIGHT } from './context'
import StorageList from './StorageList'
import DataAddButton from './DataAddButton'

const App = () => {
  const [oss, setOss] = useState<OSS | null>(null)
  useEffect(() => {
    (async () => {
      const tab = await chrome.tabs.getCurrent()  
      if (!tab || !tab.url) {
        return
      }
      const url = new URL(tab.url)
      const config = await readPageConfig(url.host)
      if (!config) {
        return
      }
      const oss = createOSSInstance(config)
      setOss(oss)
    })()
  }, [])

  return (
    <div style={{ width: 400, height: CONTAINER_HEIGHT }}>
      <DataAddButton/>
      {
        oss ? <PopupContext.Provider value={{ oss }}>
          <StorageList/>
        </PopupContext.Provider> : null
      }
    </div>
  )
}
export default App