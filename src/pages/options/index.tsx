import '@/dev/iframe-setup.ts'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import './global.css'
import { RouterProvider } from 'react-router'
import RootRoutes from './routes.tsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store from '@/store'
import './oss-ui/init.ts'
import { ToastProvider } from '@heroui/toast'

document.body.innerHTML = '<div id="app"></div>'


const root = createRoot(document.getElementById('app')!)

root.render(
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <HeroUIProvider>
        <ToastProvider/>
        <RouterProvider router={RootRoutes}/>
      </HeroUIProvider>
    </PersistGate>
  </Provider>
)

