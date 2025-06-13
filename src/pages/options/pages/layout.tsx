import React from 'react'
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router'
import { Button, Divider } from '@heroui/react'
import type { RouteMeta } from '../options-type.ts'
import Back from '@/icons/Back.tsx'
import Translation from '@/component/Translation.tsx'

const tabs = [
  {
    path: '/',
    name: <Translation i18nKey="home"/>,
  },
  {
    path: '/settings',
    name: <Translation i18nKey="settings"/>,
  }
]
const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex">
        <div className="w-[10rem]">
          <div className="flex flex-col border border-gray-200 h-full fixed left-0 top-0 w-[10rem]">
            <div className="text-center m-3 text-primary text-2xl" title="Storage Sync2 Cloud">
              CloudSync
            </div>
            <div className="flex flex-col">
              {
                tabs.map((tab) => (
                  <Button key={tab.path} radius="none" variant="light" onPress={() => navigate(tab.path)}>
                    <span className={location.pathname === tab.path ? 'font-bold' : ''}>{tab.name}</span>
                  </Button>
                ))
              }
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div>
            { 
              tabs.findIndex(v => v.path === location.pathname) >= 0
                ? null 
                : (
                  <div className="mb-2">
                    <div className="flex items-center p-2">
                      <Button isIconOnly onPress={() => navigate(-1)} variant="light" size="sm" color="primary">
                        <Back/>
                      </Button>
                      <div className="mx-1">
                        { (matches[matches.length - 1].handle as RouteMeta).name }
                      </div>
                    </div>
                    <Divider/>
                  </div>
                )
            }
          </div>
          <div className="p-4">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
