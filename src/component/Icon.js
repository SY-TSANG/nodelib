import React from 'react'
import { IconButton, Tooltip } from '@mui/material';

export const IconButtonComponent = ({ title, onClick, children }) => {
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick}>
        {children}
      </IconButton>
    </Tooltip>
  )
}

export const IconComponent = ({ title, children}) => {
  return (
    <Tooltip title={title}>
      <div>
        {children}
      </div>
    </Tooltip>
  )
}