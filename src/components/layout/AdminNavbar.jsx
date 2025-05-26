import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { deepOrange } from '@mui/material/colors';

const AdminNavbar = ({ toggleSidebar }) => {
  const { currentUser } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/admin/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/admin/settings');
    handleMenuClose();
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: 'New course submission requires review', time: '10 min ago' },
    { id: 2, text: 'System maintenance scheduled tonight', time: '2 hours ago' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {/* Sidebar toggle button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* App title */}
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: 0.5
          }}
        >
          Skill-Based Learning
          <Typography 
            component="span" 
            variant="body2" 
            sx={{ 
              ml: 1,
              color: 'text.secondary',
              verticalAlign: 'middle'
            }}
          >
            Admin Panel
          </Typography>
        </Typography>
        
        {/* Notification bell */}
        <Tooltip title="Notifications">
          <IconButton 
            color="inherit" 
            onClick={handleNotifOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        {/* User profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Account settings">
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ p: 0 }}
              aria-controls="account-menu"
              aria-haspopup="true"
            >
              <Avatar 
                alt={currentUser?.displayName || 'Admin'} 
                src={currentUser?.photoURL}
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: deepOrange[500],
                  fontSize: '1rem'
                }}
              >
                {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* Account dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 220,
                overflow: 'visible',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: 'error' }}>
                Logout
              </ListItemText>
            </MenuItem>
          </Menu>
          
          {/* Notifications dropdown menu */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                overflow: 'auto',
                mt: 1.5,
                p: 0,
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Notifications
              </Typography>
            </Box>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem key={notification.id} onClick={handleNotifClose}>
                  <ListItemText
                    primary={notification.text}
                    secondary={notification.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No new notifications
                </Typography>
              </Box>
            )}
            <Divider />
            <MenuItem onClick={handleNotifClose} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">
                View All
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;