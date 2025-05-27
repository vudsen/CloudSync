import {
  Button,
  Card,
  CardBody,
  CardHeader, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, useDisclosure
} from '@heroui/react'
import React, { useRef, useState } from 'react'
import OssProviderForm from '../../../components/OssProviderForm'
import type { ConfigFormComponentRef } from '../../../oss-ui/types.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { createNewOss, deleteOssConfig, updateOssConfig } from '@/store/oss/ossSlice.ts'
import { UsedSize } from './UsedSize.tsx'
import { showDialog } from '@/component/DialogProvider.tsx'
import { addToast } from '@heroui/toast'
import type { BaseOSSConfig } from '@/oss/type.ts'



const OssProviders:React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const dispatch = useAppDispatch()
  const configs = useAppSelector(state => state.oss.configs)
  const form = useRef<ConfigFormComponentRef>(null)
  const [ oldEntity, setOldEntity ] = useState<BaseOSSConfig>()

  const onSave = () => {
    const data = form.current!.apply()
    if (!data) {
      return
    }
    try {
      if (oldEntity) {
        dispatch(updateOssConfig(data))
        addToast({
          title: 'Update Success',
          color: 'success'
        })
      } else {
        dispatch(createNewOss(data))
        addToast({
          title: 'Create Success',
          color: 'success'
        })
      }
      onOpenChange()
    } catch (e: unknown) {
      console.error(e)
      showDialog({
        title: 'Create Failed',
        message: (e as Error).message,
        color: 'danger'
      })
    }
  }

  const onUpdate = (config: BaseOSSConfig) => {
    setOldEntity(config)
    onOpen()
  }
  
  const onDelete = (config: BaseOSSConfig) => {
    showDialog({
      title: 'Delete ' + config.name,
      message: 'Are you sure to delete this OSS provider?',
      color: 'danger',
      onConfirm() {
        try {
          dispatch(deleteOssConfig(config.id))
          addToast({
            title: 'Delete Success',
            color: 'success'
          })
        } catch (e: unknown) {
          showDialog({
            title: 'Create Failed',
            message: (e as Error).message,
            color: 'danger'
          })
        }
      }
    })
  }
  
  return (
    <div>
      <Card className="my-8">
        <CardHeader className="flex justify-between">
          <div className="text-primary text-lg">
            OSS Providers
          </div>
          <div>
            <Button variant="bordered" color="primary" onPress={onOpen}>Create Provider</Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn key="host">OSS Name</TableColumn>
              <TableColumn key="lastUpdate">Used Size</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No OSS available.">
              {
                configs.map((provider) => (
                  <TableRow key={provider.type}>
                    <TableCell>{provider.type}</TableCell>
                    <TableCell><UsedSize config={provider}/></TableCell>
                    <TableCell>
                      <Button color="primary" variant="flat" onPress={() => onUpdate(provider)}>Update</Button>
                      &nbsp;
                      <Button color="danger" variant="flat" onPress={() => onDelete(provider)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Drawer backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {
            onClose => (
              <>
                <DrawerHeader>
                  {oldEntity ? 'Update' : 'Create New'} Oss Provider
                </DrawerHeader>
                <DrawerBody>
                  <OssProviderForm oldEntity={oldEntity}  ref={form}/>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onSave}>
                    Save
                  </Button>
                </DrawerFooter>
              </>
            )
          }
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OssProviders