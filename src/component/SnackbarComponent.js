import React from 'react'
import { Alert, Snackbar } from '@mui/material';

export const SnackbarComponent = ({ severity, text, isOpen, onClose }) => {
  const closeSnaker = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose()
  }

  return (
    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={isOpen} autoHideDuration={3000} onClose={closeSnaker}>
      <Alert severity={severity} sx={{ width: '100%' }} onClose={closeSnaker}>{text}</Alert>
    </Snackbar>
  )
}
