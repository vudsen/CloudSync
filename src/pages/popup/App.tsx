import { useEffect, useState } from 'react'
import StorageList from './StorageList'
import DataAddButton from './DataAddButton'
import PopupContext from './context.ts'
import { Link } from '@nextui-org/react'

const App = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab>()

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

  return (
    <PopupContext value={{ tab, host: new URL(tab.url ?? '').host }}>
      <div style={{ width: 500, height: 500 }} className="p-5 flex flex-col">
        <div className="flex justify-between mb-3">
          <span className="text-primary font-bold text-2xl">{(new URL(tab.url ?? '')).host}</span>
          <DataAddButton/>
        </div>
        <div>
          <StorageList/>
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