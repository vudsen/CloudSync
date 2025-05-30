import { useSearchParams } from 'react-router'
import store from '@/store'
import type { HostData, StorageItem } from '@/store/oss/ossSlice.ts'
import { useEffect, useState } from 'react'
import createOssTemplate from '@/oss/template.ts'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip, Code, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, Tooltip, useDisclosure
} from '@heroui/react'
import { getHostDataById } from '@/core/host-data.ts'
import { createErrorHandler } from '@/util/common.ts'



const ViewRecordRoute: React.FC = () => {
  const [searchParams] = useSearchParams()
  const host = searchParams.get('host')
  const id = searchParams.get('id')
  const [items, setItems] = useState<StorageItem[]>([])
  const [currentHostData, setCurrentHostData] = useState<HostData>()
  const [isLoading, setLoading] = useState(true)
  const [selectedData, setSelectedData] = useState<string>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()


  const viewData = (data: string) => {
    setSelectedData(data)
    onOpen()
  }

  useEffect(() => {
    getHostDataById(host, id).then(r => {
      if (!r) {
        console.warn('host data not found')
        return
      }
      setCurrentHostData(r)
      const ossConfig = store.store.getState().oss.configs.find(v => v.id === r.ossId)
      if (!ossConfig) {
        console.warn('oss not found, id: ' + r.ossId)
        return
      }
      const template = createOssTemplate(ossConfig)
      template.queryStorages(r.remoteKey).then(r => {
        setItems(r)
      })
    }).catch(createErrorHandler('Failed to load host data')).finally(() => {
      setLoading(false)
    })
  }, [host, id])

  if (!isLoading && !currentHostData) {
    return (
      <div>
        <span>Host data not found.</span>
      </div>
    )
  }
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div>
            The Stored Items Of &nbsp;
            <Chip color="primary">{ currentHostData?.name }</Chip>
          </div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="data">Data</TableColumn>
            </TableHeader>
            <TableBody emptyContent={
              isLoading ?
                <Spinner classNames={{ label: 'text-foreground mt-4' }} label="wave" variant="wave" /> :
                'No data available.'}>
              {
                items.map(v => (
                  <TableRow key={v.name}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>
                      { v.data.length > 50 ?
                        (
                          <Tooltip content={`Click to show all (${v.data.length} chars).`}>
                            <Link className="truncate cursor-pointer" onPress={() => viewData(v.data)}>
                              {v.data.substring(0, 50)}...
                            </Link>
                          </Tooltip>
                        ) : v.data
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" scrollBehavior="inside">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Storage Data</ModalHeader>
              <ModalBody>
                <Code className="whitespace-normal break-words">{selectedData}</Code>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}


export default ViewRecordRoute