import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link
} from '@heroui/react'
import type { HostData } from '@/store/oss/ossSlice.ts'
import { deletePageData } from '@/store/oss/ossSlice.ts'
import type { ApplyStorageModalRef } from './ApplyStorageModal.tsx'
import ApplyStorageModal from './ApplyStorageModal.tsx'
import PopupContext from '../context.ts'
import { listHostData } from '@/core/host-data.ts'
import { createErrorHandler } from '@/util/common.ts'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks.ts'
import { showDialog } from '@/component/DialogProvider.tsx'
import { isRejected } from '@reduxjs/toolkit'
import { addToast } from '@heroui/toast'
import Translation from '@/component/Translation.tsx'
import getTranslation from '@/util/getTranslation'

interface StorageListProps {
  onRequireReplace: (data: HostData) => void
}

const StorageList: React.FC<StorageListProps> = props => {
  const context = useContext(PopupContext)
  const host = new URL(context.tab.url ?? '').host
  const applyRef = useRef<ApplyStorageModalRef>(null)
  const version = useSelector<RootState>(state => state.oss.version)
  const dispatch = useAppDispatch()

  const [hostDataItems, setHostDataItems] = useState<HostData[]>([])

  useEffect(() => {
    listHostData(host).then(setHostDataItems).catch(createErrorHandler('Failed to load host data'))
  }, [host, version])

  const deleteHostDataCb = (hostData: HostData) => {
    showDialog({
      title: getTranslation('delete'),
      message: getTranslation('deleteTip'),
      color: 'danger',
      onConfirm() {
        dispatch(deletePageData({
          hostData,
          host
        })).then(r => {
          if (isRejected(r)) {
            addToast({
              title: 'Delete Failed',
              description: r.error.message,
              color: 'danger'
            })
          } else {
            addToast({
              title: 'Delete Success',
              color: 'success'
            })
          }
        })
      }
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableColumn key="Name"><Translation i18nKey="name"/></TableColumn>
          <TableColumn key="action"><Translation i18nKey="actions"/></TableColumn>
        </TableHeader>
        <TableBody emptyContent={<Translation i18nKey="noData"/>}>
          {
            hostDataItems.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>
                  <Link color="primary"
                    underline="hover" 
                    className="cursor-pointer" 
                    onPress={() => applyRef.current?.apply(v)}><Translation i18nKey="apply"/></Link>
                  <Link color="secondary" underline="hover" className="cursor-pointer mx-2" onPress={() => props.onRequireReplace(v)}>
                    <Translation i18nKey="update"/>
                  </Link>
                  <Link color="danger" underline="hover" className="cursor-pointer" onPress={() => deleteHostDataCb(v)}>
                    <Translation i18nKey="delete"/>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <ApplyStorageModal ref={applyRef}/>
    </>
  )  
}

export default StorageList