import React, { useState, Children, isValidElement, cloneElement } from "react";
import { Box, Drawer, Stack, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FaAngleDoubleRight } from "react-icons/fa";

const RouteTabMax = ({ icon, label, onClick }) => {
  return (
    <ListItemButton onClick={() => onClick()}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}

const RouteTabMin = ({ icon, onClick }) => {
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
        <RouteTabMax icon={icon} label={text} path={path} onClick={onClick} />
      </ListItem>
    ) : (<>
      <ListItem disablePadding sx={{ display: { xs: 'none', lg: 'block' } }}>
        <RouteTabMax icon={icon} label={text} path={path} onClick={onClick} />
      </ListItem>

      <ListItem disablePadding sx={{ display: { lg: 'none' } }}>
        <RouteTabMin icon={icon} path={path} onClick={onClick} />
      </ListItem>
    </>)}
  </>)
}
