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
} from '@nextui-org/react'
import React from 'react'
import OssProviderForm from '../../components/OssProviderForm'

const OssProviders:React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const temp: string[] = []
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
              <TableColumn key="type">Saved sites</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No OSS available.">
              {
                temp.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>ee</TableCell>
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
                  <OssProviderForm/>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Sign in
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