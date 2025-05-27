import React, { useContext, useRef } from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@heroui/react'
import type { SubmitData } from './LocalStoragePresent.tsx'
import LocalStoragePresent from './LocalStoragePresent.tsx'
import { savePageData } from '@/store/oss/ossSlice.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import PopupContext from '../context.ts'
import type { ConfirmDialogRef } from '@/component/ConfirmDialog.tsx'
import ConfirmDialog from '@/component/ConfirmDialog.tsx'
import { isRejected } from '@reduxjs/toolkit'

const DataAddButton: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const dispatch = useAppDispatch()
  const context = useContext(PopupContext)
  const confirmDialog = useRef<ConfirmDialogRef>(null)

  const onSubmit = (data: SubmitData) => {
    dispatch(
      savePageData({
        config: data.oss,
        name: data.name,
        items: data.table,
        host: context.host
      })
    ).then(payload => {
      if (isRejected(payload)) {
        confirmDialog.current!.showDialog({
          title: 'Save Failed',
          message: 'Failed to save data: ' + payload.error.message,
          color: 'danger'
        })
        console.error(payload)
      } else {
        confirmDialog.current!.showDialog({
          title: 'Save Success',
          message: `Saved ${data.table.length} items to ${data.oss.name}`,
        })
      }
    })
    onClose()
  }
  

  return (
    <div>
      <Button onPress={onOpen} size="sm" color="primary">Save Current Page</Button>
      <ConfirmDialog ref={confirmDialog}/>
      <Drawer size="full" isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent>
          {
            (onClose) => (
              <div>
                <DrawerHeader className="flex flex-col gap-1">Save Current Page</DrawerHeader>
                <DrawerBody>
                  <LocalStoragePresent onSubmit={onSubmit} onCancel={onClose}/>
                </DrawerBody>
              </div>
            )
          }
        </DrawerContent>
      </Drawer>
    </div>
  )
}



export default DataAddButton