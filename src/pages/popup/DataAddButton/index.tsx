import React, { useRef } from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure
} from '@nextui-org/react'
import type { LocalStoragePresentRef } from './LocalStoragePresent.tsx'
import LocalStoragePresent from './LocalStoragePresent.tsx'

const DataAddButton: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const localStoragePresent = useRef<LocalStoragePresentRef>(null)

  const onSaveClick = (close: () => void) => {
    const form = localStoragePresent.current!
    if (form.isFormInvalid()) {
      return
    }
    const data = form.getSelected()
    console.log(data)
    close()
  }


  return (
    <div>
      <Button onPress={onOpen}>Save Current Data</Button>
      <Drawer size="full" isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent>
          {
            (onClose) => (
              <div>
                <DrawerHeader className="flex flex-col gap-1">Local Storage Data</DrawerHeader>
                <DrawerBody>
                  <LocalStoragePresent ref={localStoragePresent}/>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={() => onSaveClick(onClose)}>
                    Save
                  </Button>
                </DrawerFooter>
              </div>
            )
          }
        </DrawerContent>
      </Drawer>
    </div>
  )
}



export default DataAddButton