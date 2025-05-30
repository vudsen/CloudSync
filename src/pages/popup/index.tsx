import '@/dev/iframe-setup.ts'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { HeroUIProvider } from '@heroui/react'
import store from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { ToastProvider } from '@heroui/toast'
import DialogProvider from '@/component/DialogProvider.tsx'

document.body.innerHTML = '<div id="app"></div>'


const root = createRoot(document.getElementById('app')!)

root.render(
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <HeroUIProvider>
        <ToastProvider/>
        <DialogProvider/>
        <App/>
      </HeroUIProvider>
    </PersistGate>
  </Provider>
)
