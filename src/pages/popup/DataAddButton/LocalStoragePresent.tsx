import React, { useEffect, useState } from 'react'
import { sendMsgToTabAndWaitForResponse } from '@/message'
import {
  Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  Table, TableBody, TableCell, TableColumn,
  TableHeader, TableRow, Tooltip, useDisclosure,
} from '@nextui-org/react'
import type { Selection } from '@react-types/shared'

type StorageItem = {
  name: string
  data: string
}

const LocalStoragePresent = () => {
  const [ selectedKeys, setSelectedKeys ] = React.useState(new Set<string | number>())
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [ storage, setStorage ] = useState<StorageItem[]>([])
  const [ selectedItems, setSelectedItem ] = useState<StorageItem>({ name: '', data: '' })
  
  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      const tab = tabs[0]
      if (!tab|| !tab.id) {
        return
      }
      const storage = await sendMsgToTabAndWaitForResponse(tab.id, 'ReadLocalStorageResponse', 'ReadLocalStorage')
      const result: StorageItem[] = []
      for (const key of Object.keys(storage)) {
        result.push({
          name: key,
          data: storage[key],
        })
      }
      setStorage(result)
    })()
  }, [])

  const onSelectedKeyChange = (selection: Selection) => {
    if (selection === 'all') {
      setSelectedKeys(new Set(storage.map(v => v.name)))
    } else {
      setSelectedKeys(selection)
    }
  }

  const onRowClick = (item: StorageItem) => {
    setSelectedItem(item)
    onOpen()
  }


  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {
            (onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="text-ellipsis overflow-hidden max-w-64">{selectedItems.name}</div>
                </ModalHeader>
                <ModalBody>
                  <Code>
                    {selectedItems.data}
                  </Code>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )   
          }
        </ModalContent>
      </Modal>
      <Table
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        color="primary"
        isHeaderSticky
        onSelectionChange={onSelectedKeyChange}
        classNames={{
          base: 'max-h-[350px] [&>div]:overflow-x-hidden',
        }}>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody items={storage}>
          {(item) => (
            <TableRow key={item.name}>
              <TableCell>
                <Tooltip content={item.name}>
                  <div className="text-ellipsis overflow-hidden max-w-32">{item.name}</div>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Button variant="light" color="primary" onPress={() => onRowClick(item)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default LocalStoragePresent