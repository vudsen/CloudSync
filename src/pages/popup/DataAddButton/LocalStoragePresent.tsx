import type { PropsWithRef } from 'react'
import { useRef } from 'react'
import { useImperativeHandle } from 'react'
import React, { useEffect, useState } from 'react'
import { sendMsgToTabAndWaitForResponse } from '../../../shared/util/extension'
import {
  Alert,
  Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem,
  Table, TableBody, TableCell, TableColumn,
  TableHeader, TableRow, Tooltip, useDisclosure,
} from '@nextui-org/react'
import type { Selection } from '@react-types/shared'
import type { StorageItem } from '@/core/data.ts'
import type { OSSDescription } from '../../../shared/oss/factory.ts'
import { supportedOSS } from '../../../shared/oss/factory.ts'

type SelectedData = {
  table: StorageItem[]
  url: string
  oss: OSSDescription
}

export type LocalStoragePresentRef = {
  getSelected: () => SelectedData
  isFormInvalid: () => boolean
}

interface LocalStoragePresentProps {
  ref?: React.Ref<LocalStoragePresentRef>
}

const LocalStoragePresent: React.FC<PropsWithRef<LocalStoragePresentProps>> = (props) => {
  const [ selectedKeys, setSelectedKeys ] = React.useState(new Set<string | number>())
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [ storage, setStorage ] = useState<StorageItem[]>([])
  const [ selectedItems, setSelectedItem ] = useState<StorageItem>({ name: '', data: '' })
  const [ currentUrl, setCurrentUrl ] = useState<string>('')
  const select = useRef<HTMLSelectElement>(null)
  const [ tableEmptyAlertVisible, setTableEmptyAlertVisible ] = useState(false)

  useImperativeHandle(props.ref, () => ({
    getSelected: () => {
      const table: StorageItem[] = []
      for (const selectedKey of selectedKeys) {
        for (const storageItem of storage) {
          if (storageItem.name === selectedKey) {
            table.push(storageItem)
          }
        }
      }
      return {
        table,
        url: currentUrl,
        oss: supportedOSS[select.current!.selectedIndex - 1]
      }
    },
    isFormInvalid: () => {
      const sel = select.current
      if (!sel) {
        return true
      }
      if (selectedKeys.size === 0) {
        setTableEmptyAlertVisible(true)
        return true
      }
      return !sel.checkValidity()
    }
  }))

  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      const tab = tabs[0]
      if (!tab|| !tab.id) {
        return
      }
      setCurrentUrl(tab.url ?? '<unknown>')
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
    setTableEmptyAlertVisible(false)
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
      <div>
        <Select label="Select a OSS Provider" size="sm" color="primary" isRequired ref={select}>
          { 
            supportedOSS.map(oss => (
              <SelectItem key={oss.name} classNames={{
                base: '[&>*:nth-child(1)]:overflow-hidden',
              }} startContent={
                <Tooltip content={oss.description}>
                  <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                    {oss.name}
                    <span className="text-slate-500 ext-ellipsis text-xs"> {oss.description}</span>
                  </div>
                </Tooltip>
              }>
                {oss.name}
              </SelectItem>
            ))
          }
        </Select>
        <div className="my-4">
          {
            tableEmptyAlertVisible ? <Alert hideIcon color="danger" description="At least select one table item"/> : null
          }
        </div>
        <Table
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          color="primary"
          isHeaderSticky
          onSelectionChange={onSelectedKeyChange}
          classNames={{
            base: 'max-h-[300px] [&>div]:overflow-x-hidden',
          }}>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody items={storage} emptyContent={`No data on ${currentUrl}`}>
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
      </div>
    </>
  )
}

export default LocalStoragePresent