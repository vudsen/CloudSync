import { useNavigate, useSearchParams } from 'react-router'
import {
  Card,
  CardBody,
  CardHeader, Link, Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import React, { useEffect, useRef, useState } from 'react'
import type { HostData } from '@/store/oss/ossSlice.ts'
import { deletePageData } from '@/store/oss/ossSlice.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import type { ConfirmDialogRef } from '@/component/ConfirmDialog.tsx'
import ConfirmDialog from '@/component/ConfirmDialog.tsx'
import { addToast } from '@heroui/toast'
import { isRejected } from '@reduxjs/toolkit'
import { listHostData } from '@/core/host-data.ts'
import { createErrorHandler } from '@/util/common.ts'

const SiteDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const host = searchParams.get('host')
  const [isLoading, setLoading] = useState(true)
  const [hostDataItems, setHostDataItems] = useState<HostData[]>([])
  const navigate = useNavigate()
  const confirmDialog = useRef<ConfirmDialogRef>(null)
  const dispatch = useAppDispatch()


  useEffect(() => {
    listHostData(host).then(setHostDataItems).catch(createErrorHandler('Failed to load host data')).finally(() => {
      setLoading(false)
    })
  }, [host])
  
  if ((hostDataItems.length === 0 && !isLoading) || !host) {
    return (
      <div>
        <span>No data available.</span>
      </div>
    )
  }

  const viewData = (id: string) => {
    navigate(`/detail/view?${new URLSearchParams({ host, id }).toString()}`)
  }

  const deleteData = (hostData: HostData) => {
    confirmDialog.current!.showDialog({
      title: 'Delete',
      message: 'Are you sure you want to delete this record?',
      color: 'danger',
      onConfirm: () => {
        dispatch(deletePageData({ hostData, host })).then((r) => {
          if (isRejected(r)) {
            addToast({
              title: 'Delete Failed',
              description: r.error.message,
              color: 'danger',
            })
            return
          }
          addToast({
            title: 'Delete Success',
            description: 'Record deleted successfully.',
            color: 'success',
          })
        })
      }
    })
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="text-primary text-lg font-bold">
            {host}
          </div>
        </CardHeader>
        <CardBody>
          <Table >
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="count">Last Update</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={
              isLoading ? 
                <Spinner classNames={{ label: 'text-foreground mt-4' }} label="wave" variant="wave" /> :
                'No data available'
            }>
              {
                hostDataItems.map(data => (
                  <TableRow key={data.remoteKey}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.updateDate}</TableCell>
                    <TableCell>
                      <Link color="primary" underline="hover" className="cursor-pointer" onPress={() => viewData(data.id)}>View</Link>
                      <Link color="danger" underline="hover" className="cursor-pointer mx-3" onPress={() => deleteData(data)}>Delete</Link>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <ConfirmDialog ref={confirmDialog}/>
    </>
  )
}

export default SiteDetail
