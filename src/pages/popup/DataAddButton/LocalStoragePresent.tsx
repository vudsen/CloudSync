import React, { useContext, useRef, useEffect, useState } from 'react'
import { sendMsgToTabAndWaitForResponse } from '@/util/extension.ts'
import {
  Alert,
  Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner,
  Table, TableBody, TableCell, TableColumn,
  TableHeader, TableRow, Textarea, Tooltip, useDisclosure,
} from '@heroui/react'
import type { Selection } from '@react-types/shared'
import { useAppSelector } from '@/store/hooks.ts'
import type { StorageItem } from '@/store/oss/ossSlice.ts'
import PopupContext from '../context.ts'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { addToast } from '@heroui/toast'
import type { BaseOSSConfig } from '@/oss/type.ts'

type Inputs = {
  oss: string
  name: string
}

export type SubmitData = {
  table: StorageItem[]
  oss: BaseOSSConfig
  name: string
}

interface LocalStoragePresentProps {
  onSubmit: (data: SubmitData) => void
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
  const [loading, setLoading] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  useEffect(() => {
    setLoading(true)
    ;(async () => {
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
      addToast({
        title: 'Error',
        description: 'Failed to load local storage data',
        color: 'danger',
      })
    }).finally(() => {
      setLoading(false)
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

  const onSubmit: SubmitHandler<Inputs> = (data, event) => {
    event?.preventDefault()
    if (selectedKeys.size === 0) {
      setTableEmptyAlertVisible(true)
      return
    }

    props.onSubmit({
      name: data.name,
      table: storage.filter(v => selectedKeys.has(v.name)),
      oss: configs.find(v => v.name === data.oss)!,
    })
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
          <TableBody isLoading={loading} loadingContent={<Spinner label="Loading..." />} items={storage} emptyContent={
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