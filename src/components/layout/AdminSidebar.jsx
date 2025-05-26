import React, { useState, useEffect } from 'react';
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
  Box,
  Typography,
  useTheme,
  styled,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Book as BookIcon,
  LibraryBooks as SubModuleIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  School as CoursesIcon,
  Assessment as ReportsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth = 260 }) => {
  const theme = useTheme();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    modules: false,
    subModules: false,
    users: false
  });

  // Auto-expand menu items based on current route
  useEffect(() => {
    setExpandedItems({
      modules: location.pathname.includes('/admin/modules'),
      subModules: location.pathname.includes('/admin/submodules'),
      users: location.pathname.includes('/admin/users')
    });
  }, [location]);

  const handleItemClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main
      }
    },
    '&.Mui-selected:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15)
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }));

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: theme.palette.background.paper
    }}>
      {/* Logo/Header Area */}
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '64px !important'
      }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      
      <Divider />
      
      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <StyledListItemButton 
            component={Link} 
            to="/admin/dashboard"
            selected={location.pathname === '/admin/dashboard'}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </StyledListItemButton>
        </ListItem>
        
        {/* Modules Section */}
        <ListItem disablePadding>
          <StyledListItemButton 
            onClick={() => handleItemClick('modules')}
            selected={location.pathname.includes('/admin/modules')}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Modules" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            {expandedItems.modules ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>
        <Collapse in={expandedItems.modules} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <StyledListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/admin/modules"
                selected={location.pathname === '/admin/modules'}
              >
                <ListItemText 
                  primary="All Modules" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </StyledListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <StyledListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/admin/modules/new"
                selected={location.pathname === '/admin/modules/new'}
              >
                <ListItemText 
                  primary="Add New" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </StyledListItemButton>
            </ListItem>
          </List>
        </Collapse>
        
        {/* Sub-Modules Section */}
        <ListItem disablePadding>
          <StyledListItemButton 
            onClick={() => handleItemClick('subModules')}
            selected={location.pathname.includes('/admin/submodules')}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <SubModuleIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Sub-Modules" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            {expandedItems.subModules ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>
        <Collapse in={expandedItems.subModules} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <StyledListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/admin/submodules"
                selected={location.pathname === '/admin/submodules'}
              >
                <ListItemText 
                  primary="All Sub-Modules" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </StyledListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <StyledListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/admin/submodules/new"
                selected={location.pathname === '/admin/submodules/new'}
              >
                <ListItemText 
                  primary="Add New" 
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </StyledListItemButton>
            </ListItem>
          </List>
        </Collapse>
        
        {/* Additional Menu Items */}
        {/* <ListItem disablePadding>
          <StyledListItemButton 
            component={Link} 
            to="/admin/users"
            selected={location.pathname.includes('/admin/users')}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Users" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </StyledListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <StyledListItemButton 
            component={Link} 
            to="/admin/courses"
            selected={location.pathname.includes('/admin/courses')}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <CoursesIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Courses" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </StyledListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <StyledListItemButton 
            component={Link} 
            to="/admin/reports"
            selected={location.pathname.includes('/admin/reports')}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <ReportsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Reports" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </StyledListItemButton>
        </ListItem> */}
      </List>
      
      {/* Bottom Section */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <List>
          <ListItem disablePadding>
            <StyledListItemButton 
              component={Link} 
              to="/admin/settings"
              selected={location.pathname.includes('/admin/settings')}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </StyledListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <StyledListItemButton 
              component={Link} 
              to="/admin/help"
              selected={location.pathname.includes('/admin/help')}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Help Center" 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </StyledListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
        zIndex: theme.zIndex.drawer
      }}
      aria-label="admin sidebar"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: theme.shadows[8]
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            backgroundColor: theme.palette.background.paper
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;