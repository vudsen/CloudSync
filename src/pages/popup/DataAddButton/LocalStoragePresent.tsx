import React, { useContext, useRef, useEffect, useState } from 'react'
import { sendMsgToTabAndWaitForResponse } from '@/util/extension.ts'
import {
  Alert,
  Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem,
  Table, TableBody, TableCell, TableColumn,
  TableHeader, TableRow, Textarea, Tooltip, useDisclosure,
} from '@heroui/react'
import type { Selection } from '@react-types/shared'
import { useAppSelector } from '@/store/hooks.ts'
import type { BaseOSSConfig } from '@/oss/type.ts'
import type { StorageItem } from '@/store/oss/ossSlice.ts'
import PopupContext from '../context.ts'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

export type SelectedData = {
  table: StorageItem[]
  url: string
  oss: BaseOSSConfig
  name: string
}


interface LocalStoragePresentProps {
  onSubmit: (data: SelectedData) => void
  onCancel: () => void
}

const LocalStoragePresent: React.FC<LocalStoragePresentProps> = (props) => {
  const [ selectedKeys, setSelectedKeys ] = React.useState(new Set<string | number>())
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [ storage, setStorage ] = useState<StorageItem[]>([])
  const [ selectedItems, setSelectedItem ] = useState<StorageItem>({ name: '', data: '' })
  const [ tableEmptyAlertVisible, setTableEmptyAlertVisible ] = useState(false)
  const configs = useAppSelector(state => state.oss.configs)
  const context = useContext(PopupContext)
  const host = context.host

  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
  } = useForm<SelectedData>()

  useEffect(() => {
    (async () => {
      if (!context.tab.id) {
        return
      }
      const storage = await sendMsgToTabAndWaitForResponse('ReadLocalStorageResponse', 'ReadLocalStorage', {
        tabId: context.tab.id,
      })
      const result: StorageItem[] = []
      for (const key of Object.keys(storage)) {
        result.push({
          name: key,
          data: storage[key],
        })
      }
      setStorage(result)
    })().catch(e => {
      console.error(e)
    })
  }, [context.tab.id])

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

  const onSubmit: SubmitHandler<SelectedData> = (data, event) => {
    event?.preventDefault()
    if (selectedKeys.size === 0) {
      setTableEmptyAlertVisible(true)
      return
    }
    onSubmit(data)
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
                  <Textarea value={selectedItems.data}/>
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
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" placeholder="Name" isRequired type="text" {...register('name')}/>
        <Select label="OSS Provider" size="sm" color="primary" className="my-4" isRequired {...register('oss')}>
          {
            configs.map(oss => (
              <SelectItem key={oss.name} classNames={{
                base: '[&>*:nth-child(1)]:overflow-hidden',
              }}>
                {oss.name}
              </SelectItem>
            ))
          }
        </Select>
        <div className="my-4 w-full">
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
          <TableBody items={storage} emptyContent={
            <p className="text-ellipsis overflow-hidden">No data on {host}</p>
          }>
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
        <div className="flex flex-row-reverse my-4">
          <Button type="submit" color="primary">Save</Button>
          <Button variant="light" color="danger" onPress={props.onCancel} className="mx-2">Close</Button>
        </div>
      </form>
    </>
  )
}

export default LocalStoragePresent