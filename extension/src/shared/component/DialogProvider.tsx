import React, { useEffect, useRef } from 'react'
import type { ConfirmDialogRef, DialogConfig } from '@/component/ConfirmDialog.tsx'
import ConfirmDialog from '@/component/ConfirmDialog.tsx'


type Listener<T> = (e: T) => void

interface Receiver<T> {
  addElement: (e: T) => void
  addElementAddListener: (listener: Listener<T>) => void
}


function SingleElementQueue(): Receiver<DialogConfig> {
  const listeners: Array<Listener<DialogConfig>> = []
  return {
    addElement(e) {
      for (const listener of listeners) {
        listener(e)
      }
    },
    addElementAddListener: (listener) => {
      listeners.push(listener)
    }
  }
}

let globalDialogReceiver: Receiver<DialogConfig> | undefined = undefined

const getDialogQueue = () => {
  if (globalDialogReceiver) {
    return globalDialogReceiver
  }
  globalDialogReceiver = SingleElementQueue()
  return globalDialogReceiver
}

const DialogProvider: React.FC = () => {
  const dialog = useRef<ConfirmDialogRef>(null)
  
  useEffect(() => {
    getDialogQueue().addElementAddListener((e) => {
      dialog.current?.showDialog(e)
    })
  }, [])
  
  return (
    <ConfirmDialog ref={dialog}/>
  )
}

export const showDialog = (config: DialogConfig) => {
  getDialogQueue().addElement(config)
}

export default DialogProvider