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
import type { HostData, StorageItem } from '@/store/oss/ossSlice.ts'
import PopupContext from '../context.ts'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { addToast } from '@heroui/toast'
import type { BaseOSSConfig } from '@/oss/type.ts'
import Translation from '@/component/Translation.tsx'
import getTranslation from '@/util/getTranslation'

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
  onSubmit: (data: SubmitData) => Promise<void>
  onCancel: () => void
  oldState?: HostData
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
  const [tableLoading, setTableLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>()

  useEffect(() => {
    setTableLoading(true)
    ;(async () => {
      if (!context.tab.id) {
        return
      }
      const storage = await sendMsgToTabAndWaitForResponse('ReadLocalStorageResponse', 'ReadLocalStorage', {
        tabId: context.tab.id,
      })
      if (typeof storage === 'string') {
        addToast({
          title: getTranslation('error'),
          description: storage,
          color: 'danger',
        })
        return
      }
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
        title: getTranslation('error'),
        description: 'Failed to load local storage data',
        color: 'danger',
      })
    }).finally(() => {
      setTableLoading(false)
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

    setSubmitLoading(true)
    props.onSubmit({
      name: data.name,
      table: storage.filter(v => selectedKeys.has(v.name)),
      oss: configs.find(v => v.id === data.oss)!,
    }).finally(() => {
      setSubmitLoading(false)
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
                    <Translation i18nKey="close"/>
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={<Translation i18nKey="name"/>}
          isRequired
          type="text"
          {...register('name')}
          defaultValue={props.oldState?.name}/>
        <Select
          label={<Translation i18nKey="ossProvider"/>}
          size="sm"
          color="primary"
          className="my-4"
          isRequired
          {...register('oss')}
          defaultSelectedKeys={props.oldState ? [props.oldState.ossId] : []}
        >
          {
            configs.map(oss => (
              <SelectItem key={oss.id} classNames={{
                base: '[&>*:nth-child(1)]:overflow-hidden',
              }}>
                {oss.name}
              </SelectItem>
            ))
          }
        </Select>
        <div className="my-4 w-full">
          {
            tableEmptyAlertVisible ? <Alert hideIcon color="danger" description={<Translation i18nKey="atLeastSelectOne"/>}/> : null
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
            <TableColumn><Translation i18nKey="name"/></TableColumn>
            <TableColumn><Translation i18nKey="actions"/></TableColumn>
          </TableHeader>
          <TableBody isLoading={tableLoading} loadingContent={<Spinner label="Loading..." />} items={storage} emptyContent={
            <p className="text-ellipsis overflow-hidden">
              <Translation i18nKey="noDataOnSite" args={[host]} />
            </p>
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
                    <Translation i18nKey="view"/>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-row-reverse my-4">
          <Button type="submit" color="primary" isLoading={submitLoading}>
            {props.oldState ? <Translation i18nKey="update"/> : <Translation i18nKey="save"/>}
          </Button>
          <Button variant="light" color="danger" onPress={props.onCancel} className="mx-2">
            <Translation i18nKey="close"/>
          </Button>
        </div>
      </form>
    </>
  )
}

export default LocalStoragePresent