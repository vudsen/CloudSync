import React, { Fragment, useState } from 'react'
import { Collapse, Icon, ListItemButton, ListItemText } from '@mui/material'

interface ListItemProps {
  name: string
  value: string
}

const ListItem: React.FC<ListItemProps> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClick = () => {
    setOpen(!open)
  }
  return (
    <Fragment>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={props.name}/>
        {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.value}
      </Collapse>
    </Fragment>
  )
}

export default ListItem