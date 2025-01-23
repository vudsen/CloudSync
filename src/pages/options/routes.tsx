import { Routes, Route } from 'react-router'
import React from 'react'
import Layout from './pages/layout.tsx'

const OverView = React.lazy(() => import('./pages/Overview'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Storages = React.lazy(() => import('./pages/Storages'))


const RootRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route index element={<OverView/>} />
        <Route path="settings" element={<Settings/>} />
        <Route path="storages" element={<Storages/>} />
      </Route>
    </Routes>
  )
}

export default RootRoutes