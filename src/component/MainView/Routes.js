import React, { useState, Children, isValidElement, cloneElement } from "react";
import { Box, Drawer, Stack, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FaAngleDoubleRight } from "react-icons/fa";

const RouteTabLg = ({ icon, label, onClick }) => {
  return (
    <ListItemButton onClick={() => onClick()}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}

const RouteTabXs = ({ icon, onClick }) => {
  return (
    <IconButton style={{"marginLeft": "auto", "marginRight": "auto"}} onClick={() => onClick()}>
      {icon}
    </IconButton>
  )
}

export const RouteTab = ({ icon, text, path, navigate, open, handleDrawerClose }) => {
  const onClick = () => {
    handleDrawerClose && handleDrawerClose()
    navigate(path)
  }

  return (<>
    {(open === true) ? (
      <ListItem disablePadding>
        <RouteTabLg icon={icon} label={text} path={path} onClick={onClick} />
      </ListItem>
    ) : (<>
      <ListItem disablePadding sx={{ display: { xs: 'none', lg: 'block' } }}>
        <RouteTabLg icon={icon} label={text} path={path} onClick={onClick} />
      </ListItem>

      <ListItem disablePadding sx={{ display: { lg: 'none' } }}>
        <RouteTabXs icon={icon} path={path} onClick={onClick} />
      </ListItem>
    </>)}
  </>)
}
