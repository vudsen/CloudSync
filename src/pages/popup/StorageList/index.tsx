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
      title: 'Delete',
      message: 'Are you sure you want to delete this record?',
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
          <TableColumn key="Name">Name</TableColumn>
          <TableColumn key="action">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No data'}>
          {
            hostDataItems.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>
                  <Link color="primary"
                    underline="hover" 
                    className="cursor-pointer" 
                    onPress={() => applyRef.current?.apply(v)}>Apply</Link>
                  <Link color="secondary" underline="hover" className="cursor-pointer mx-2" onPress={() => props.onRequireReplace(v)}>Update</Link>
                  <Link color="danger" underline="hover" className="cursor-pointer" onPress={() => deleteHostDataCb(v)}>Delete</Link>
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