import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import './global.css'
import iframeSetup from '@/dev/iframe-setup.ts'
import { BrowserRouter } from 'react-router'
import RootRoutes from './routes.tsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store from '@/store'
import './oss-ui/init.ts'

document.body.innerHTML = '<div id="app"></div>'

iframeSetup()

const root = createRoot(document.getElementById('app')!)

root.render(
  <BrowserRouter basename="/pages/options.html">
    <Provider store={store.store}>
      <PersistGate persistor={store.persistor}>
        <NextUIProvider>
          <RootRoutes/>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)

