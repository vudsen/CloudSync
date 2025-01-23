import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import React from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { SavedHost } from '@/store/statistics/statisticsSlice.ts'

const SavedSites: React.FC = () => {
  const hosts = useSelector<RootState, SavedHost[]>((state) => state.statistics.savedHosts)
  
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
            <TableColumn key="lastUpdate">Last Update</TableColumn>
            <TableColumn key="type">Storage Type</TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'Nothing saved.'}>
            {
              hosts.map(host => (
                <TableRow key={host.host}>
                  <TableCell>{host.host}</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>{host.type}</TableCell>
                  <TableCell>Actions</TableCell>
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
