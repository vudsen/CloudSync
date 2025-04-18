import React, { useEffect, useRef, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link
} from '@nextui-org/react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { HostData } from '@/store/oss/ossSlice.ts'
import type { ApplyStorageModalRef } from './ApplyStorageModal.tsx'
import ApplyStorageModal from './ApplyStorageModal.tsx'

const StorageList: React.FC = () => {
  const [host, setHost] = useState<string>()
  const applyRef = useRef<ApplyStorageModalRef>(null)

  const items = useSelector<RootState, HostData[]>(state => {
    if (!host) {
      return []
    }
    return state.oss.index[host] ?? []
  })
  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      const url = new URL(tabs[0].url!)
      setHost(url.host)
    })()
  }, [])
  

  return (
    <>
      <Table>
        <TableHeader>
          <TableColumn key="Name">Name</TableColumn>
          <TableColumn key="action">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {
            items.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.name}</TableCell>
                <TableCell>
                  <Link color="primary"
                    underline="hover" 
                    className="cursor-pointer" 
                    onPress={() => applyRef.current?.apply(v)}>Apply</Link>
                  <Link color="danger" underline="hover" className="cursor-pointer mx-2">Delete</Link>
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