import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import PopupContext from '../context'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react'
import type { Selection } from '@react-types/shared'

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'action',
    label: 'VIEW',
  },
]

const StorageList: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set<string | number>())
  const ctx = useContext(PopupContext)
  const [storages, setStorages] = useState<string[]>([])
  
  useEffect(() => {
    (async () => {
      setStorages(await ctx.oss.listKeys())
    })()
  }, [ctx.oss])

  const onSelectedKeyChange = (selection: Selection) => {
    if (selection === 'all') {
      // TODO
    } else {
      setSelectedKeys(selection)
    }
  }

  return (
    <Table
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={onSelectedKeyChange}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={storages}>
        {(item) => (
          <TableRow key={item}>
            <TableCell>{item}</TableCell>
            <TableCell>
              <Button variant="light" color="primary">
                View
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )  
}

export default StorageList