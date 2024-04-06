import React from 'react'
import { Modal, Box, Stack } from '@mui/material';
import { FaTimes } from 'react-icons/fa';

export const ModalComponent = ({ height, maxHeight, width, isOpen, toggle, backgroudColor, close, children  }) => {  
  if (backgroudColor == null) {
    backgroudColor = "white"
  }

  return (
    <Modal open={isOpen} onClose={() => toggle && toggle()}>
      <Box className='column-flex' sx={{
        top: '50%',
        left: '50%',
        height: height,
        maxHeight: maxHeight,
        width: width,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        bgcolor: backgroudColor
      }}>
        {(close) &&
          <div>
            <Stack justifyContent="end" direction="row" spacing={2}>
              <FaTimes size={20} className='ms-auto' style={{"margin": "10px", "color": backgroudColor, "-webkit-filter": "invert(100%)"}} onClick={() => toggle()}/>
            </Stack>    
          </div>
        }
        
        <Box style={{"flexGrow": "1", "width": "100%", "overflowY": "auto"}}>
          {children}
        </Box>
      </Box>
    </Modal>
  )
}
