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
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'modules'));
        const modulesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'modules', id));
      setModules(modules.filter(module => module.id !== id));
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Modules</Typography>
        <Button 
          component={Link} 
          to="/admin/modules/new" 
          variant="contained"
        >
          Add New Module
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={module.thumbnail_url || '/placeholder.jpg'}
                alt={module.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Level: {module.level}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/admin/modules/edit/${module.id}`}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(module.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModuleList;