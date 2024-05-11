import React from 'react'
import { Backdrop, CircularProgress  } from '@mui/material'

export const LoadingScreen = ({ isOpen, text }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isOpen}>
      <div style={{"display": "flex", "flexFlow": "row", "padding": "20px"}}>
        <CircularProgress />
        <div style={{"marginLeft": "10px", "marginTop": "auto", "marginBottom": "auto"}}>{text}</div>
      </div>
    </Backdrop>
  )
}
