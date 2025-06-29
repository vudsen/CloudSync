import { createHashRouter } from 'react-router'
import React from 'react'
import Layout from './pages/layout.tsx'
import type { RouteMeta } from './options-type.ts'
import { getTranslationAsReactNode } from '@/util/getTranslation.tsx'

const OverView = React.lazy(() => import('./pages/(Home)'))
const Settings = React.lazy(() => import('./pages/settings'))
const SiteDetail = React.lazy(() => import('./pages/detail'))
const ViewRecordRoute = React.lazy(() => import('./pages/detail/view'))

const RootRoutes = createHashRouter([
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
          name: getTranslationAsReactNode('siteDetail'),
        } satisfies RouteMeta
      },
      {
        path: '/detail/view',
        element: <ViewRecordRoute/>,
        handle: {
          name: getTranslationAsReactNode('storageDetail'),
        } satisfies RouteMeta,
      }
    ]
  }
])

export default RootRoutes