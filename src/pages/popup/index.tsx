import '@/dev/iframe-setup.ts'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { NextUIProvider } from '@nextui-org/react'
import store from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

document.body.innerHTML = '<div id="app"></div>'


const root = createRoot(document.getElementById('app')!)

root.render(
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <NextUIProvider>
        <App/>
      </NextUIProvider>
    </PersistGate>
  </Provider>
)
