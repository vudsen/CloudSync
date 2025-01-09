import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import PopupContext from '../context'
import { List, ListItemButton, ListItemText } from '@mui/material'


const StorageList: React.FC = () => {
  const ctx = useContext(PopupContext)
  const [storages, setStorages] = useState<string[]>([])
  
  useEffect(() => {
    (async () => {
      setStorages(await ctx.oss.listKeys())
    })()
  }, [])

  const onListItemClick = (e: unknown) => {
    console.log(e)
  }

  return (
    <List>
      {
        storages.map(storage => (
          <ListItemButton key={storage} onClick={onListItemClick}>
            <ListItemText>{storage}</ListItemText>
          </ListItemButton>
        ))
      }
    </List>
  )  
}

export default StorageList