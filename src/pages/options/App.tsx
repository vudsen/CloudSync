import React from 'react'
import { Tab, Tabs } from '@nextui-org/react'

const App: React.FC = () => {
  return (
    <div className="w-full">
      <Tabs aria-label="Options" classNames={{
        tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center text-white',
        cursor: 'w-full bg-white',
        tab: 'max-w-fit px-0 h-12',
        tabContent: 'group-data-[selected=true]:text-white text-base font-bold',
        base: 'w-full bg-primary-200',
      }}
      color="default"
      variant="underlined">
        <Tab key="Overview" title="Overview">
          {/* Display oss and each usag. */}
          overview
        </Tab>
        <Tab key="Storages" title="Storages">
          storages
        </Tab>
        <Tab key="Settings" title="Seetings">
          settings
        </Tab>
      </Tabs>
    </div>
  )
}

export default App