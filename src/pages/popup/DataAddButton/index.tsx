import React from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from '@nextui-org/react'
import type { SelectedData } from './LocalStoragePresent.tsx'
import LocalStoragePresent from './LocalStoragePresent.tsx'
import { savePageData } from '@/store/oss/ossSlice.ts'
import { useAppDispatch } from '@/store/hooks.ts'

const DataAddButton: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const dispatch = useAppDispatch()

  const onSubmit = (data: SelectedData) => {
    console.log(data)
    dispatch(
      savePageData({
        config: data.oss,
        name: data.name,
        items: data.table,
        host: new URL(data.url).host
      })
    ).catch(e => {
      console.log(e)
    })
    onClose()
  }
  

  return (
    <div>
      <Button onPress={onOpen} size="sm" color="primary">Save Current Page</Button>
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