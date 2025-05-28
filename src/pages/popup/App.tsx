import { useEffect, useRef, useState } from 'react'
import StorageList from './StorageList'
import type { DataAddButtonRef } from './DataAddButton'
import DataAddButton from './DataAddButton'
import PopupContext from './context.ts'
import { Link } from '@heroui/react'
import type { HostData } from '@/store/oss/ossSlice.ts'

const App = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab>()
  const dataAddDialog = useRef<DataAddButtonRef>(null)

  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      setTab(tabs[0])
    })().catch(e => {
      console.error(e)
    })
  }, [])
  
  if (!tab) {
    return (
      <div>Not a tab page.</div>
    )
  }

  const toOptions = () => {
    chrome.runtime.openOptionsPage().catch(e => {
      console.error(e)
    })
  }
  
  const onRequireUpdate = (data: HostData) => {
    dataAddDialog.current!.openDialog(data)
  }

  const host = tab.url ? (new URL(tab.url)).host : '<Unknown>'

  return (
    <PopupContext value={{ tab, host: new URL(tab.url ?? '').host }}>
      <div style={{ width: 500, height: 500 }} className="p-5 flex flex-col">
        <div className="flex justify-between mb-3">
          <span className="text-primary font-bold text-2xl max-w-1/2 overflow-hidden text-ellipsis" title={host}>
            {host}
          </span>
          <DataAddButton ref={dataAddDialog}/>
        </div>
        <div>
          <StorageList onRequireReplace={onRequireUpdate}/>
        </div>
        <div className="flex-1"/>
        <div className="flex justify-around">
          <Link size="sm" color="primary" isBlock showAnchorIcon className="cursor-pointer" onPress={toOptions}>Options</Link>
          <Link size="sm" color="secondary" isBlock showAnchorIcon className="cursor-pointer">Github</Link>
        </div>
      </div>
    </PopupContext>
  )
}
export default App