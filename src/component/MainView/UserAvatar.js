import React, { useState,Children, isValidElement, cloneElement } from 'react'
import { Box, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, IconButton, Menu } from '@mui/material'

import { ModalComponent } from '../Modal';

export const UserAvatar = ({ picture, namePrimary, nameSecondary, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalInfo, setModalInfo] = useState({
    "isOpen": false,
    "name": ""
  });

  const toggleMenu = (name) => {
    setModalInfo(prev => ({ ...prev,
      isOpen: !modalInfo["isOpen"],
      name: name
    }))

    setAnchorEl(null)
  }

  Children.toArray(children).forEach(child => {
    console.log(child)
    console.log(child.type.displayName)
    console.log(child.props)
  });

  console.log()

  return (<>
    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
      <ListItem disablePadding>
        <ListItemButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <ListItemAvatar>
            <Avatar src={picture} />
          </ListItemAvatar>
          <ListItemText primary={namePrimary} secondary={nameSecondary}/>
        </ListItemButton>
      </ListItem>
    </Box>

    <ListItem disablePadding sx={{ display: { lg: 'none' } }}>
      <IconButton style={{"marginLeft": "auto", "marginRight": "auto"}} onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Avatar src={picture}  style={{"marginLeft": "auto", "marginRight": "auto"}}/>
      </IconButton>
    </ListItem>

    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }} >
      {Children.toArray(children).map(child => {
        if (child.type.displayName === "AvatarMenu") {
          return isValidElement(child) ?  cloneElement(child, {
            toggleMenu: toggleMenu,
          }) : child 
        }
      })}
    </Menu>

    {Children.toArray(children).map(child => {
      if (child.type.displayName === "AvatarModal") {
        return isValidElement(child) ?  cloneElement(child, {
          toggleMenu: toggleMenu,
          isOpen: modalInfo["isOpen"] && modalInfo["name"] === child.props.name
        }) : child 
      }
    })}
  </>)
}

export const AvatarMenu = ({ name, text, callback, toggleMenu }) => {
  const onClick = () => {
    name && toggleMenu(name)
    callback && callback()
  }

  return (<>
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} >
        <ListItemText primary={text}/>
      </ListItemButton>
    </ListItem>
  </>)
}

export const AvatarModal = ({ name, modalConfig, isOpen, toggleMenu, children }) => {
  return (
    <ModalComponent maxHeight={modalConfig["maxHeight"]} width={modalConfig["width"]} isOpen={isOpen} toggle={() => toggleMenu()}>
      {children}
    </ModalComponent>
  )
}
