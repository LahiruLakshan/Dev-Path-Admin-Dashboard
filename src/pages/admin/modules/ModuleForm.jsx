// src/pages/admin/modules/ModuleForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  collection,
  addDoc 
} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  FormHelperText,
  LinearProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [moduleData, setModuleData] = useState({
    title: '',
    level: 'Beginner',
    thumbnail_url: '',
    description: ''
  });
  const [touched, setTouched] = useState({
    title: false,
    level: false
  });

  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim().length >= 3;
      case 'level':
        return ['Beginner', 'Intermediate', 'Advanced'].includes(value);
      default:
        return true;
    }
  };

  const isFormValid = () => {
    return (
      validateField('title', moduleData.title) &&
      validateField('level', moduleData.level)
    );
  };

  useEffect(() => {
    if (id) {
      const fetchModule = async () => {
        try {
          setLoading(true);
          const docRef = doc(db, 'modules', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setModuleData(docSnap.data());
          } else {
            setError('Module not found');
          }
        } catch (error) {
          console.error('Error fetching module:', error);
          setError('Failed to load module data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchModule();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dev-path');
      formData.append('cloud_name', 'dl3mpo0w3');
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/dl3mpo0w3/image/upload`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setModuleData(prev => ({
            ...prev,
            thumbnail_url: data.secure_url
          }));
        } else {
          setError('Failed to upload image');
        }
      };
      xhr.onerror = () => {
        setError('Network error during upload');
      };
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        // Update existing module
        await setDoc(doc(db, 'modules', id), {
          ...moduleData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new module
        await addDoc(collection(db, 'modules'), {
          ...moduleData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/modules'), 1500);
    } catch (error) {
      console.error('Error saving module:', error);
      setError('Failed to save module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/modules');
  };

  if (loading && !moduleData.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {id ? 'Edit Module' : 'Create New Module'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Module saved successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <TextField
                  fullWidth
                  label="Module Title"
                  name="title"
                  value={moduleData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={touched.title && !validateField('title', moduleData.title)}
                  helperText={
                    touched.title && !validateField('title', moduleData.title) 
                      ? 'Title must be at least 3 characters' 
                      : ''
                  }
                  onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={moduleData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Enter a detailed description of the module"
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    name="level"
                    value={moduleData.level}
                    label="Difficulty Level"
                    onChange={handleChange}
                    error={touched.level && !validateField('level', moduleData.level)}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                  {touched.level && !validateField('level', moduleData.level) && (
                    <FormHelperText error>Please select a valid level</FormHelperText>
                  )}
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thumbnail Image
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {moduleData.thumbnail_url ? (
                    <>
                      <Avatar
                        src={moduleData.thumbnail_url}
                        variant="rounded"
                        sx={{ 
                          width: '100%', 
                          height: 200,
                          mb: 2
                        }}
                      />
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                        sx={{ mb: 2 }}
                      >
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          hidden
                        />
                      </Button>
                    </>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploading}
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        hidden
                      />
                    </Button>
                  )}
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Uploading: {uploadProgress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                      />
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" align="center">
                    Recommended: Square image, 500x500px, JPG/PNG/WEBP
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          mt: 4 
        }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading || uploading || !isFormValid()}
          >
            {loading ? 'Saving...' : 'Save Module'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ModuleForm;