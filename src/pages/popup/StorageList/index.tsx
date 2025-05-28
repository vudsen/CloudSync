import React, { useContext, useRef } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link
} from '@heroui/react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { HostData } from '@/store/oss/ossSlice.ts'
import type { ApplyStorageModalRef } from './ApplyStorageModal.tsx'
import ApplyStorageModal from './ApplyStorageModal.tsx'
import PopupContext from '../context.ts'

interface StorageListProps {
  onRequireReplace: (data: HostData) => void
}

const StorageList: React.FC<StorageListProps> = props => {
  const context = useContext(PopupContext)
  const host = new URL(context.tab.url ?? '').host
  const applyRef = useRef<ApplyStorageModalRef>(null)

  const items = useSelector<RootState, HostData[]>(state => {
    if (!host) {
      return []
    }
    return state.oss.index[host] ?? []
  })

  return (
    <>
      <Table>
        <TableHeader>
          <TableColumn key="Name">Name</TableColumn>
          <TableColumn key="action">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No data'}>
          {
            items.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>
                  <Link color="primary"
                    underline="hover" 
                    className="cursor-pointer" 
                    onPress={() => applyRef.current?.apply(v)}>Apply</Link>
                  <Link color="secondary" underline="hover" className="cursor-pointer mx-2" onPress={() => props.onRequireReplace(v)}>Update</Link>
                  <Link color="danger" underline="hover" className="cursor-pointer">Delete</Link>
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