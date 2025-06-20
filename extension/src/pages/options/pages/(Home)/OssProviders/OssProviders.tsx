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
import Translation from '@/component/Translation.tsx'
import getTranslation from "@/util/getTranslation";



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
        title: getTranslation('createFailed'),
        message: (e as Error).message,
        color: 'danger',
        hideCancel: true
      })
    }
  }

  const onUpdate = (config: BaseOSSConfig) => {
    setOldEntity(config)
    onOpen()
  }
  
  const onDelete = (config: BaseOSSConfig) => {
    showDialog({
      title: getTranslation('delete') + ' ' + config.name,
      message: getTranslation('deleteOssTip'),
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
            title: getTranslation('createFailed'),
            message: (e as Error).message,
            color: 'danger',
            hideCancel: true
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
            <Translation i18nKey="ossProvider"/>
          </div>
          <div>
            <Button variant="bordered" color="primary" onPress={onOpen}>
              <Translation i18nKey="createOssProvider"/>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn key="host">
                <Translation i18nKey="name"/>
              </TableColumn>
              <TableColumn key="usedBytes">
                <Translation i18nKey="usedBytes"/>
              </TableColumn>
              <TableColumn key="actions">
                <Translation i18nKey="actions"/>
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent="No OSS available.">
              {
                configs.map((provider) => (
                  <TableRow key={provider.type}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell><UsedSize config={provider}/></TableCell>
                    <TableCell>
                      <Button color="primary" variant="flat" onPress={() => onUpdate(provider)}>
                        <Translation i18nKey="update"/>
                      </Button>
                      &nbsp;
                      <Button color="danger" variant="flat" onPress={() => onDelete(provider)}>
                        <Translation i18nKey="delete"/>
                      </Button>
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
                  {oldEntity ? <Translation i18nKey="updateOssProvider"/> : <Translation i18nKey="createOssProvider"/>}
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