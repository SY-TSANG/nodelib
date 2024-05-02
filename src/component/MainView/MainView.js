import React, { useState, Children, isValidElement, cloneElement } from "react";
import { Box, Drawer, Stack, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FaAngleDoubleRight } from "react-icons/fa";

import { UserAvatar, AvatarMenu, AvatarModal } from './UserAvatar'
import { RouteTab, Routes } from './Routes'
import { useWindowSize } from '../../useHook/useWindowSize';

const drawerWidth = {
  "xs": 90,
  "lg": 260
}

export const MainView = ({ children}) => {
  const windowSize = useWindowSize()

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
      <Box sx={{ width: { xs: drawerWidth["xs"], lg: drawerWidth["lg"] }}} >
        <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {xs: drawerWidth["xs"], lg: drawerWidth["lg"]} } }}>
          <Box sx={{ display: 'block' }} >
            <Box sx={{ display: 'flex', flexDirection: 'column'}} style={{"height": "100vh"}}>
              <Stack justifyContent="space-between" direction="column" spacing={2} style={{"height": "100%"}}>
                <Box>
                  {children[0]}

                  <List>
                    {children[1]}
                  </List>
                </Box>
                
                <Box>
                  {children[2]} 

                  <ListItem disablePadding sx={{ display: { lg: 'none' } }}>
                    <FaAngleDoubleRight style={{"marginLeft": "auto", "marginRight": "auto", "marginTop": "15px", "marginBottom": "15px"}} onClick={() => handleDrawerToggle()} />
                  </ListItem>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Drawer>

        <Drawer variant="temporary" open={mobileOpen} onTransitionEnd={handleDrawerTransitionEnd} onClose={handleDrawerClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth["lg"] } }}>
          <Box sx={{ display: 'block' }} >
            <Box sx={{ display: 'flex', flexDirection: 'column'}} style={{"height": "100vh"}}>
              <Stack justifyContent="space-between" direction="column" spacing={2} style={{"height": "100%"}}>
                <Box>
                  {children[0]}
                  
                  <List>
                  {
                    cloneElement(children[1], { open: true })
                  }
                  </List>
                </Box>

                <Box>
                  {
                    cloneElement(children[2], { open: true })
                  }
                </Box>
              </Stack>
            </Box>
          </Box>
        </Drawer>
      </Box>

      <Box component="main" sx={{ width: { xs: windowSize["width"]-drawerWidth["xs"], lg: windowSize["width"]-drawerWidth["lg"] }, height: "100vh", p:2 }} > 
        {children[3]} 
      </Box>
    </Box>
  )
}

const Header = ({ children }) => <>{children}</>
const Body = ({ children }) => <>{children}</>

MainView.Routes = Routes
MainView.Route = RouteTab
MainView.Header = Header
MainView.Body = Body

MainView.UserAvatar = UserAvatar
MainView.AvatarMenu = AvatarMenu
MainView.AvatarModal = AvatarModal

MainView.AvatarMenu.displayName = "AvatarMenu"
MainView.AvatarModal.displayName = "AvatarModal"