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
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Grid, 
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
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Delete, 
  MoreVert,
  VideoLibrary,
  PictureAsPdf
} from '@mui/icons-material';

const SubModuleList = () => {
  const [subModules, setSubModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchSubModules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sub_modules'));
        const subModulesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubModules(subModulesData);
      } catch (error) {
        console.error('Error fetching sub-modules:', error);
      } finally {
        setLoading(false);
      }
    };

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'sub_modules', id));
      setSubModules(subModules.filter(subModule => subModule.id !== id));
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting sub-module:', error);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sub-Modules</Typography>
        <Button 
          component={Link} 
          to="/admin/submodules/new" 
          variant="contained"
          color="primary"
        >
          Add New Sub-Module
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Resources</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subModules.map((subModule) => (
              <TableRow key={subModule.id}>
                <TableCell>
                  {subModule.thumbnail_url && (
                    <CardMedia
                      component="img"
                      sx={{ width: 80, height: 45, objectFit: 'cover' }}
                      image={subModule.thumbnail_url}
                      alt={subModule.title}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">
                    {subModule.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {subModule.module_title}
                  </Typography>
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
                    {subModule.watch_videos && (
                      <IconButton
                        component="a"
                        href={subModule.watch_videos}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        color="primary"
                      >
                        <VideoLibrary />
                      </IconButton>
                    )}
                    {subModule.pdf_note && (
                      <IconButton
                        component="a"
                        href={subModule.pdf_note}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        color="secondary"
                      >
                        <PictureAsPdf />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, subModule.id)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          component={Link} 
          to={`/admin/submodules/edit/${selectedId}`}
          onClick={handleMenuClose}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {subModules.length === 0 && !loading && (
        <Typography align="center" sx={{ mt: 4 }}>
          No sub-modules found. Create your first one!
        </Typography>
      )}
    </Box>
  );
};

export default SubModuleList;