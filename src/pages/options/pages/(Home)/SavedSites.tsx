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
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { BasicRouteState } from '../../options-type.ts'
import { listSavedSites } from '@/core/host-data.ts'
import { createErrorHandler } from '@/util/common.ts'
import Translation from '@/component/Translation.tsx'

const SavedSites: React.FC = () => {
  const [hosts, setHosts] = useState<string[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    listSavedSites().then(setHosts).catch(createErrorHandler('Failed to load saved sites'))
  }, [])
  
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
          <Translation i18nKey="savedSites"/>
        </div>
      </CardHeader>
      <CardBody>
        <Table>
          <TableHeader>
            <TableColumn key="host">Host</TableColumn>
            <TableColumn key="actions">
              <Translation i18nKey="actions"/>
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={'Nothing saved.'}>
            {
              hosts.map((host) => (
                <React.Fragment key={host}>
                  {
                    <TableRow>
                      <TableCell>{host}</TableCell>
                      <TableCell>
                        <Button color="primary" variant="light" onPress={() => toHostDetail(host)}>
                          <Translation i18nKey="detail"/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  }
                </React.Fragment>
              ))
            }
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default SavedSites
