import React, { useRef } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { Tab, Tabs } from '@nextui-org/react'


const Layout: React.FC = () => {
  const navigate = useNavigate()
  const lastRoute = useRef<string>(null)
  const onSelectChange = (k: string | number) => {
    if (typeof k !== 'string') {
      throw new Error('Unexpected type: ' + k)
    }
    k = k.toLowerCase()
    let des: string
    if (k === 'overview') {
      des = '/'
    } else {
      des = '/' + k
    }
    if (lastRoute.current) {
      if (lastRoute.current !== des) {
        lastRoute.current = des
        navigate(des)
      }
    } else {
      lastRoute.current = des
    }
  }

  return (
    <div className="w-full">
      <Tabs aria-label="Options" classNames={{
        tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center',
        cursor: 'w-full bg-blue-600',
        tab: 'max-w-fit px-0 h-12',
        tabContent: 'group-data-[selected=true]:text-blue-600 text-base font-bold',
        base: 'w-full bg-primary-100',
      }}
      onSelectionChange={onSelectChange}
      color="default"
      variant="underlined">
        <Tab key="Overview" title="Overview">
          <Outlet/>
        </Tab>
        <Tab key="Storages" title="Storages">
          <Outlet/>
        </Tab>
        <Tab key="Settings" title="Seetings">
          <Outlet/>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Layout
