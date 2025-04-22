import { useNavigate, useSearchParams } from 'react-router'
import {
  Card,
  CardBody,
  CardHeader, Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { HostData } from '@/store/oss/ossSlice.ts'
import { deletePageData } from '@/store/oss/ossSlice.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import type { ConfirmDialogRef } from '@/component/ConfirmDialog.tsx'
import ConfirmDialog from '@/component/ConfirmDialog.tsx'
import { addToast } from '@heroui/toast'

const SiteDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const host = searchParams.get('host')
  const index = useSelector<RootState, HostData[] | undefined>(
    state => host ? state.oss.index[host] : undefined
  )
  const navigate = useNavigate()
  const confirmDialog = useRef<ConfirmDialogRef>(null)
  const dispatch = useAppDispatch()
  
  if (!index || !host) {
    return (
      <div>
        <span>No host provided.</span>
      </div>
    )
  }

  const viewData = (id: string) => {
    navigate(`/detail/view?${new URLSearchParams({ host, id }).toString()}`)
  }

  const deleteData = (id: string) => {
    confirmDialog.current!.showDialog({
      title: 'Delete',
      message: 'Are you sure you want to delete this record?',
      color: 'danger',
      onConfirm: () => {
        dispatch(deletePageData({ host: host, id })).then(() => {
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
            <TableBody emptyContent="No data available">
              {
                index.map(idx => (
                  <TableRow key={idx.remoteKey}>
                    <TableCell>{idx.name}</TableCell>
                    <TableCell>{idx.updateDate}</TableCell>
                    <TableCell>
                      <Link color="primary" underline="hover" className="cursor-pointer" onPress={() => viewData(idx.id)}>View</Link>
                      <Link color="danger" underline="hover" className="cursor-pointer mx-3" onPress={() => deleteData(idx.id)}>Delete</Link>
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
