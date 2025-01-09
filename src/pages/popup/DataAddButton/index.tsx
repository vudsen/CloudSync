import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton, List,
  Toolbar,
  Typography
} from '@mui/material'
import { sendMsgToTabAndWaitForResponse } from '@/message'
import ListItem from './ListItem'

const LocalStoragePresent = () => {
  const [storage, setStorage] = useState<Record<string, string> | undefined>()
  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
      const tab = tabs[0]
      if (!tab|| !tab.id) {
        return
      }
      setStorage(await sendMsgToTabAndWaitForResponse(tab.id, 'ReadLocalStorageResponse', 'ReadLocalStorage'))
    })()
  }, [])

  if (!storage) {
    return (
      <div>Failed to load localstorage</div>
    )
  }
  return (
    <List sx={{ width: '100%' }}>
      {
        Object.keys(storage).map((key: string) => (
          <ListItem name={key} key={key} value={storage[key]}/>
        ))
      }
    </List>
  )
}

const DataAddButton: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)

  const onSaveClick = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={onSaveClick}>Save Current Data</Button>
      <Dialog fullScreen open={open}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              LocalStorage Data
            </Typography>
            <Button autoFocus color="inherit" onClick={onClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <LocalStoragePresent/>
        </DialogContent>
      </Dialog>
    </div>
  )
}



export default DataAddButton