import { useEffect, useState } from 'react'
import { readConfig } from '@/plugin-data'
import type { OSS } from '@/oss/type'
import { createOSSInstance } from '@/oss/factory'
import PopupContext, {CONTAINER_HEIGHT} from './context'
import StorageList from './StorageList'
import DataAddButton from './DataAddButton'

const PopupPage = () => {
  const [oss, setOss] = useState<OSS | null>(null)
  useEffect(() => {
    (async () => {
      const tab = await chrome.tabs.getCurrent()  
      if (!tab || !tab.url) {
        return
      }
      const url = new URL(tab.url)
      const config = await readConfig(url.host)
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
          <div>
            <StorageList/>
          </div>
        </PopupContext.Provider> : null
      }
    </div>
  )
}
export default PopupPage