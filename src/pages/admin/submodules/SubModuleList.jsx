// src/pages/admin/submodules/SubModuleList.js
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  Box, 
  Button, 
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  Skeleton,
  LinearProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Delete, 
  MoreVert,
  VideoLibrary,
  PictureAsPdf,
  Add,
  Refresh,
  Warning
} from '@mui/icons-material';

const SubModuleList = () => {
  const [subModules, setSubModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSubModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, 'sub_modules'));
      const subModulesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubModules(subModulesData);
    } catch (error) {
      console.error('Error fetching sub-modules:', error);
      setError('Failed to load sub-modules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubModules();
  }, []);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'sub_modules', selectedId));
      setSubModules(subModules.filter(subModule => subModule.id !== selectedId));
      setSuccess('Sub-module deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting sub-module:', error);
      setError('Failed to delete sub-module. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  const getResourceTypeIcon = (url) => {
    if (!url) return null;
    if (url.includes('youtube') || url.includes('vimeo') || url.includes('.mp4')) {
      return <VideoLibrary color="primary" />;
    }
    if (url.includes('.pdf')) {
      return <PictureAsPdf color="error" />;
    }
    return <Warning color="warning" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3 
        }}>
          <Typography variant="h4" component="h1">
            Sub-Modules Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh list">
              <IconButton onClick={fetchSubModules} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Button 
              component={Link} 
              to="/admin/submodules/new" 
              variant="contained"
              startIcon={<Add />}
              size="large"
            >
              New Sub-Module
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={handleCloseSnackbar}>
            {success}
          </Alert>
        )}
        
        {loading && subModules.length === 0 ? (
          <>
            <LinearProgress sx={{ mb: 2 }} />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {[...Array(6)].map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {[...Array(6)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : subModules.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sub-modules found
            </Typography>
            <Button 
              component={Link} 
              to="/admin/submodules/new" 
              variant="contained"
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Create your first sub-module
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Resources</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subModules.map((subModule) => (
                  <TableRow 
                    key={subModule.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={subModule.thumbnail_url}
                        sx={{ width: 80, height: 45 }}
                      >
                        {!subModule.thumbnail_url && <VideoLibrary />}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {subModule.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subModule.description?.substring(0, 50)}{subModule.description?.length > 50 ? '...' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={subModule.module_title} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={subModule.level} 
                        color={getLevelColor(subModule.level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {subModule.video_url && (
                          <Tooltip title="Video Resource">
                            {getResourceTypeIcon(subModule.video_url)}
                          </Tooltip>
                        )}
                        {subModule.pdf_url && (
                          <Tooltip title="PDF Resource">
                            {getResourceTypeIcon(subModule.pdf_url)}
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, subModule.id)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          component={Link} 
          to={`/admin/submodules/edit/${selectedId}`}
          onClick={handleMenuClose}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sub-module? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubModuleList;