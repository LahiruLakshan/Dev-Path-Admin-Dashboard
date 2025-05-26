import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  useTheme, 
  IconButton,
  Typography,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
// import Breadcrumbs from './Breadcrumbs'; // You'll need to create this component
// import NotificationBar from './NotificationBar'; // You'll need to create this component

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Simulate loading state (remove in production)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDrawerToggle = () => {
    if (isClosing) return;
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
    setTimeout(() => setIsClosing(false), 300); // Match transition duration
  };

  // Auto-close drawer on mobile when navigating
  useEffect(() => {
    if (isMobile && mobileOpen) {
      handleDrawerClose();
    }
  }, [location]);

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <CssBaseline />
      
      {/* Top Navigation Bar */}
      <AdminNavbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 2,
            display: { sm: 'none' } // Only show on mobile
          }}
        >
          {mobileOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Admin Dashboard
        </Typography>
      </AdminNavbar>
      
      {/* Sidebar */}
      <AdminSidebar 
        mobileOpen={mobileOpen} 
        handleDrawerClose={handleDrawerClose}
      />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${theme.drawerWidth}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(mobileOpen && {
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        
        {/* Loading indicator (remove if not needed) */}
        {loading && <LinearProgress color="primary" sx={{ mb: 2 }} />}
        
        {/* Notification bar for system messages */}
        {/* <NotificationBar /> */}
        
        {/* Breadcrumb navigation */}
        {/* <Breadcrumbs /> */}
        
        {/* Main content */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            p: 3,
            minHeight: 'calc(100vh - 120px)'
          }}
        >
          <Outlet />
        </Box>
        
        {/* Footer (optional) */}
        <Box sx={{ 
          mt: 3,
          py: 2,
          textAlign: 'center',
          color: theme.palette.text.secondary
        }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Admin Dashboard v1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;