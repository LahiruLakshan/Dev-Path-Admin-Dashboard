// src/pages/admin/modules/ModuleList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Grid, 
  Typography,
  Skeleton,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'modules'));
      const modulesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setModules(modulesData);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to load modules. Please try again.');
      setSnackbarMessage('Failed to load modules');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, 'modules', moduleToDelete.id));
      setModules(modules.filter(module => module.id !== moduleToDelete.id));
      setSnackbarMessage('Module deleted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting module:', error);
      setSnackbarMessage('Failed to delete module');
      setOpenSnackbar(true);
    } finally {
      setDeleteDialogOpen(false);
      setModuleToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setModuleToDelete(null);
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
            Module Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh modules">
              <IconButton onClick={fetchModules} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button 
              component={Link} 
              to="/admin/modules/new" 
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
            >
              New Module
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading && modules.length === 0 ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </CardContent>
                  <CardActions>
                    <Skeleton variant="rectangular" width={64} height={36} />
                    <Skeleton variant="rectangular" width={64} height={36} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : modules.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No modules found
            </Typography>
            <Button 
              component={Link} 
              to="/admin/modules/new" 
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Create your first module
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {modules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={module.thumbnail_url || '/placeholder.jpg'}
                    alt={module.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {module.description || 'No description available'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        Level: {module.level}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lessons: {module.lesson_count || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Edit module">
                      <IconButton 
                        component={Link} 
                        to={`/admin/modules/edit/${module.id}`}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete module">
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteClick(module)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the module "{moduleToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ModuleList;