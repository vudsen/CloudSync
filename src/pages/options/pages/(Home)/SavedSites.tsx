import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@heroui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { OssIndexRecord } from '@/store/oss/ossSlice.ts'
import { useNavigate } from 'react-router'
import type { BasicRouteState } from '../../options-type.ts'

const SavedSites: React.FC = () => {
  const hosts = useSelector<RootState, OssIndexRecord>((state) => state.oss.index)
  const navigate = useNavigate()
  const toHostDetail = (host: string) => {
    navigate('/detail?host=' + host, {
      state: {
        pageName: host,
      } satisfies BasicRouteState
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-primary text-lg">
          Saved Sites
        </div>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn key="host">Host</TableColumn>
            <TableColumn key="type">Record Count</TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'Nothing saved.'}>
            {
              Object.entries(hosts).map(([host, idx]) => (
                <TableRow key={host}>
                  <TableCell>{host}</TableCell>
                  <TableCell>{idx.length}</TableCell>
                  <TableCell>
                    <Button color="primary" variant="light" onPress={() => toHostDetail(host)}>Detail</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default SavedSites
