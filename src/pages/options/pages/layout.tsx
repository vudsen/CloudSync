import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Button } from '@nextui-org/react'


const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // const matches = useMatches()

  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-[10rem]">
          <div className="flex flex-col border border-gray-200 h-full fixed left-0 top-0 w-[10rem]">
            <div className="text-center m-3 text-primary text-2xl">
              My Logo
            </div>
            <div className="flex flex-col">
              <Button radius="none" variant="light" onPress={() => navigate('/')}>
                <span className={location.pathname === '/' ? 'font-bold' : ''}>Home</span>
              </Button>
              <Button radius="none" variant="light" onPress={() => navigate('/storages')}>
                <span className={location.pathname === '/storages' ? 'font-bold' : ''}>Storages</span>
              </Button>
              <Button radius="none" variant="light" onPress={() => navigate('/settings')}>
                <span className={location.pathname === '/settings' ? 'font-bold' : ''}>Settings</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {/*<div>*/}
          {/*<Breadcrumbs>*/}
          {/*  {matches.map(v => (*/}
          {/*    v.handle && (v.handle as RouteMeta).name ? (*/}
          {/*      <BreadcrumbItem key={v.id}>{(v.handle as RouteMeta).name}</BreadcrumbItem>*/}
          {/*    ) : null*/}
          {/*  ))}*/}
          {/*</Breadcrumbs>*/}
          {/*</div>*/}
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
