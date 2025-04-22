import {
  Button,
  Card,
  CardBody,
  CardHeader, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, useDisclosure
} from '@heroui/react'
import React, { useRef } from 'react'
import OssProviderForm from '../../../components/OssProviderForm'
import type { ConfigFormComponentRef } from '../../../oss-ui/types.ts'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { createNewOss } from '@/store/oss/ossSlice.ts'
import { UsedSize } from './UsedSize.tsx'



const OssProviders:React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const dispatch = useAppDispatch()
  const configs = useAppSelector(state => state.oss.configs)
  const form = useRef<ConfigFormComponentRef>(null)

  const onSave = () => {
    const data = form.current!.apply()
    if (!data) {
      return
    }
    dispatch(createNewOss(data))
    onOpenChange()
  }

  return (
    <div>
      <Card className="my-8">
        <CardHeader className="flex justify-between">
          <div className="text-primary text-lg">
            OSS Providers
          </div>
          <div>
            <Button variant="bordered" color="primary" onPress={onOpen}>Create Provider</Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn key="host">OSS Name</TableColumn>
              <TableColumn key="lastUpdate">Used Size</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No OSS available.">
              {
                configs.map((provider) => (
                  <TableRow key={provider.type}>
                    <TableCell>{provider.type}</TableCell>
                    <TableCell><UsedSize config={provider}/></TableCell>
                    <TableCell>
                      <Button color="danger" variant="flat">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <Drawer backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {
            onClose => (
              <>
                <DrawerHeader>
                  Create New Oss Provider
                </DrawerHeader>
                <DrawerBody>
                  <OssProviderForm ref={form}/>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onSave}>
                    Save
                  </Button>
                </DrawerFooter>
              </>
            )
          }
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OssProviders