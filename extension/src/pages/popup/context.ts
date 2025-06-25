import { createContext } from 'react'


interface PopupContextState {
  tab: chrome.tabs.Tab
  host: string
}

const PopupContext = createContext<PopupContextState>({
  // init later
  tab: null as unknown as chrome.tabs.Tab,
  host: ''
})

export default PopupContext