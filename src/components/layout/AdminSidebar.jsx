import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Collapse,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  LibraryBooks as SubModuleIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) => {
  const [openModules, setOpenModules] = useState(false);
  const [openSubModules, setOpenSubModules] = useState(false);
  const location = useLocation();

  const handleModuleClick = () => {
    setOpenModules(!openModules);
  };

  const handleSubModuleClick = () => {
    setOpenSubModules(!openSubModules);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/admin/dashboard"
            selected={location.pathname === '/admin/dashboard'}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem> */}
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleModuleClick}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Modules" />
            {openModules ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openModules} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }} 
              component={Link} 
              to="/admin/modules"
              selected={location.pathname === '/admin/modules'}
            >
              <ListItemText primary="All Modules" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }} 
              component={Link} 
              to="/admin/modules/new"
              selected={location.pathname === '/admin/modules/new'}
            >
              <ListItemText primary="Add New" />
            </ListItemButton>
          </List>
        </Collapse>
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleSubModuleClick}>
            <ListItemIcon>
              <SubModuleIcon />
            </ListItemIcon>
            <ListItemText primary="Sub-Modules" />
            {openSubModules ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubModules} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }} 
              component={Link} 
              to="/admin/submodules"
              selected={location.pathname === '/admin/submodules'}
            >
              <ListItemText primary="All Sub-Modules" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }} 
              component={Link} 
              to="/admin/submodules/new"
              selected={location.pathname === '/admin/submodules/new'}
            >
              <ListItemText primary="Add New" />
            </ListItemButton>
          </List>
        </Collapse>
        
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/admin/profile"
            selected={location.pathname === '/admin/profile'}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="admin sidebar"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;