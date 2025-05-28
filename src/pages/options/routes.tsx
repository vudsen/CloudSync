import { createBrowserRouter } from 'react-router'
import React from 'react'
import Layout from './pages/layout.tsx'
import type { RouteMeta } from './options-type.ts'

const OverView = React.lazy(() => import('./pages/(Home)'))
const Settings = React.lazy(() => import('./pages/settings'))
const SiteDetail = React.lazy(() => import('./pages/detail'))
const ViewRecordRoute = React.lazy(() => import('./pages/detail/view'))

const RootRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <OverView/>,
        handle: {
          name: 'Home',
        } satisfies RouteMeta
      },
      {
        path: '/settings',
        element: <Settings/>,
        handle: {
          name: 'Settings',
        } satisfies RouteMeta,
      },
      {
        path: '/detail',
        element: <SiteDetail/>,
        handle: {
          name: 'Site Detail',
        } satisfies RouteMeta
      },
      {
        path: '/detail/view',
        element: <ViewRecordRoute/>,
        handle: {
          name: 'Storage Detail',
        } satisfies RouteMeta,
      }
    ]
  }
], { basename: '/pages/options.html' })

export default RootRoutes