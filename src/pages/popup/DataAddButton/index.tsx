import React, { useContext, useImperativeHandle, useRef } from 'react'
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
import type { HostData } from '@/store/oss/ossSlice.ts'
import { replacePageData } from '@/store/oss/ossSlice.ts'
import { savePageData } from '@/store/oss/ossSlice.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import PopupContext from '../context.ts'
import type { ConfirmDialogRef } from '@/component/ConfirmDialog.tsx'
import ConfirmDialog from '@/component/ConfirmDialog.tsx'
import { isRejected } from '@reduxjs/toolkit'
import Translation from '@/component/Translation.tsx'
import { getTranslationAsReactNode } from '@/util/getTranslation'

export interface DataAddButtonRef {
  openDialog: (entity?: HostData) => void
}

interface DataAddButtonProps {
  ref: React.RefObject<DataAddButtonRef | null>
}

const DataAddButton: React.FC<DataAddButtonProps> = props => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const dispatch = useAppDispatch()
  const context = useContext(PopupContext)
  const confirmDialog = useRef<ConfirmDialogRef>(null)
  const oldEntity = useRef<HostData | undefined>(undefined)

  const openCreateDialog = () => {
    oldEntity.current = undefined
    onOpen()
  }

  useImperativeHandle(props.ref, () => ({
    openDialog(upd) {
      oldEntity.current = upd
      onOpen()
    }
  }))

  const onSubmit = (data: SubmitData) => {
    let promise: Promise<unknown>
    if (oldEntity.current) {
      promise = dispatch(replacePageData({
        entity: {
          name: data.name,
          items: data.table,
          newOssConfig: oldEntity.current.ossId != data.oss.id ? data.oss : undefined,
        },
        hostDataId: oldEntity.current.id,
        host: context.host,
        config: data.oss
      }))
    } else {
      promise = dispatch(savePageData({
        config: data.oss,
        name: data.name,
        items: data.table,
        host: context.host
      }))
    }
    promise.then(payload => {
      if (isRejected(payload)) {
        confirmDialog.current!.showDialog({
          title: 'Save Failed',
          message: getTranslationAsReactNode('saveFailed', payload.error.message),
          color: 'danger'
        })
        console.error(payload)
      } else {
        confirmDialog.current!.showDialog({
          title: getTranslationAsReactNode('saveSuccess'),
          color: 'primary',
          message: getTranslationAsReactNode('storageSaveSuccess', [data.table.length, data.oss.name]),
        })
      }
    })
    onClose()
  }


  return (
    <div>
      <Button onPress={openCreateDialog} size="sm" color="primary">
        <Translation i18nKey="saveCurrentPage"/>
      </Button>
      <ConfirmDialog ref={confirmDialog}/>
      <Drawer size="full" isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom">
        <DrawerContent>
          {
            (onClose) => (
              <div>
                <DrawerHeader className="flex flex-col gap-1">
                  <Translation i18nKey="saveCurrentPage"/>
                </DrawerHeader>
                <DrawerBody>
                  <LocalStoragePresent onSubmit={onSubmit} onCancel={onClose} oldState={oldEntity.current}/>
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