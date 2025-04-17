import { useSearchParams } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { HostData, StorageItem } from '@/store/oss/ossSlice.ts'
import type { BaseOSSConfig } from '@/oss/type.ts'
import { useEffect, useState } from 'react'
import createOssTemplate from '@/oss/template.ts'
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'

type State = {
  hostData: HostData
  ossConfig: BaseOSSConfig
}

const ViewRecordRoute: React.FC = () => {
  const [searchParams] = useSearchParams()
  const host = searchParams.get('host')
  const id = searchParams.get('id')
  const [items, setItems] = useState<StorageItem[]>([])

  const state = useSelector<RootState, State | undefined>(state => {
    if (!host || !id) {
      return undefined
    }
    const hostData = state.oss.index[host]?.find(v => v.id === id)
    if (!hostData) {
      console.log(state.oss.index[host], host)
      console.warn('host data not found')
      return undefined
    }
    const ossConfig = state.oss.configs.find(v => v.id === hostData.ossId)
    if (!ossConfig) {
      console.warn('oss not found, id: ' + hostData.ossId)
      return undefined
    }
    return {
      hostData,
      ossConfig
    }
  })
  
  useEffect(() => {
    if (!state) {
      return
    }
    const template = createOssTemplate(state.ossConfig)
    template.queryStorages(state.hostData.remoteKey).then(r => {
      setItems(r)
    })
  }, [state])

  if (!state) {
    return (
      <div>
        <span>Host data not found.</span>
      </div>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <div>
          The Stored Items Of &nbsp;
          <Chip color="primary">{ state.hostData.name }</Chip>
        </div>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="data">Data</TableColumn>
          </TableHeader>
          <TableBody>
            {
              items.map(v => (
                <TableRow key={v.name}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.data}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}


export default ViewRecordRoute