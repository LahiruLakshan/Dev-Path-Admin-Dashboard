// src/pages/admin/submodules/SubModuleForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs
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
  FormHelperText,
  Paper,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Avatar,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { 
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  PictureAsPdf,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SubModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modules, setModules] = useState([]);
  const [touched, setTouched] = useState({
    module_id: false,
    title: false,
    level: false
  });

  const [subModuleData, setSubModuleData] = useState({
    module_id: '',
    module_title: '',
    title: '',
    level: 'Beginner',
    thumbnail_url: '',
    sub_module_content: '',
    video_url: '',
    pdf_url: '',
    additional_resources: ''
  });

  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case 'module_id':
        return !!value;
      case 'title':
        return value.trim().length >= 3;
      case 'level':
        return ['Beginner', 'Intermediate', 'Advanced'].includes(value);
      case 'video_url':
        return !value || value.includes('youtube.com') || value.includes('vimeo.com');
      default:
        return true;
    }
  };

  const isFormValid = () => {
    return (
      validateField('module_id', subModuleData.module_id) &&
      validateField('title', subModuleData.title) &&
      validateField('level', subModuleData.level) &&
      validateField('video_url', subModuleData.video_url)
    );
  };

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
        setError('Failed to load modules');
      }
    };

    fetchModules();

    if (id) {
      const fetchSubModule = async () => {
        try {
          setLoading(true);
          const docRef = doc(db, 'sub_modules', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setSubModuleData(docSnap.data());
          } else {
            setError('Sub-module not found');
          }
        } catch (error) {
          console.error('Error fetching sub-module:', error);
          setError('Failed to load sub-module data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubModule();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubModuleData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleModuleChange = (e) => {
    const moduleId = e.target.value;
    const selectedModule = modules.find(m => m.id === moduleId);
    
    setSubModuleData(prev => ({
      ...prev,
      module_id: moduleId,
      module_title: selectedModule?.title || '',
      level: selectedModule?.level || 'Beginner'
    }));
    setTouched(prev => ({ ...prev, module_id: true }));
  };

  const handleContentChange = (value) => {
    setSubModuleData(prev => ({
      ...prev,
      sub_module_content: value
    }));
  };

  const uploadToCloudinary = async (file, fieldName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dev-path');
    formData.append('cloud_name', 'dl3mpo0w3');
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/dl3mpo0w3/auto/upload`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          return JSON.parse(xhr.responseText).secure_url;
        }
        throw new Error('Upload failed');
      };
      xhr.send(formData);
      
      const data = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
      });
      
      return data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${fieldName} to Cloudinary:`, error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validPdfTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (
      (fieldName === 'thumbnail_url' && !validImageTypes.includes(file.type)) ||
      (['pdf_url', 'additional_resources'].includes(fieldName) && !validPdfTypes.includes(file.type))
    ) {
      setError(`Invalid file type for ${fieldName.replace('_', ' ')}`);
      return;
    }
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }
    
    try {
      const downloadURL = await uploadToCloudinary(file, fieldName);
      
      setSubModuleData(prev => ({
        ...prev,
        [fieldName]: downloadURL
      }));
      setSuccess(`${fieldName.replace('_', ' ')} uploaded successfully`);
    } catch (error) {
      console.error('Error handling file upload:', error);
      setError(`Failed to upload ${fieldName.replace('_', ' ')}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (id) {
        // Update existing sub-module
        await setDoc(doc(db, 'sub_modules', id), {
          ...subModuleData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new sub-module
        await addDoc(collection(db, 'sub_modules'), {
          ...subModuleData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setSuccess('Sub-module saved successfully');
      setTimeout(() => navigate('/admin/submodules'), 1500);
    } catch (error) {
      console.error('Error saving sub-module:', error);
      setError('Failed to save sub-module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/submodules');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  if (loading && !subModuleData.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {id ? 'Edit Sub-Module' : 'Create New Sub-Module'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          icon={<CheckCircleIcon fontSize="inherit" />}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <CardContent>
                <FormControl fullWidth margin="normal" required error={touched.module_id && !validateField('module_id', subModuleData.module_id)}>
                  <InputLabel>Parent Module</InputLabel>
                  <Select
                    name="module_id"
                    value={subModuleData.module_id}
                    label="Parent Module"
                    onChange={handleModuleChange}
                    disabled={!!id}
                    onBlur={() => setTouched(prev => ({ ...prev, module_id: true }))}
                  >
                    {modules.map((module) => (
                      <MenuItem key={module.id} value={module.id}>
                        {module.title} <Chip label={module.level} size="small" sx={{ ml: 1 }} color={getLevelColor(module.level)} />
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.module_id && !validateField('module_id', subModuleData.module_id) && (
                    <FormHelperText>Please select a module</FormHelperText>
                  )}
                  {subModuleData.module_title && (
                    <FormHelperText sx={{ mt: 1 }}>
                      Selected Module: <strong>{subModuleData.module_title}</strong>
                    </FormHelperText>
                  )}
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Sub-Module Title"
                  name="title"
                  value={subModuleData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={touched.title && !validateField('title', subModuleData.title)}
                  helperText={
                    touched.title && !validateField('title', subModuleData.title) 
                      ? 'Title must be at least 3 characters' 
                      : ''
                  }
                  onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    name="level"
                    value={subModuleData.level}
                    label="Difficulty Level"
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, level: true }))}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Video Content
                  </Typography>
                  <TextField
                    fullWidth
                    label="Video URL (YouTube/Vimeo)"
                    name="video_url"
                    value={subModuleData.video_url}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="https://www.youtube.com/watch?v=..."
                    error={touched.video_url && !validateField('video_url', subModuleData.video_url)}
                    helperText={
                      touched.video_url && !validateField('video_url', subModuleData.video_url)
                        ? 'Please enter a valid YouTube or Vimeo URL'
                        : 'Paste a YouTube or Vimeo video URL'
                    }
                    InputProps={{
                      startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ mt: 4, p: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Content Editor
                </Typography>
                <ReactQuill
                  theme="snow"
                  value={subModuleData.sub_module_content}
                  onChange={handleContentChange}
                  style={{ height: 400, marginBottom: 50 }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Thumbnail Image
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Avatar
                    variant="rounded"
                    src={subModuleData.thumbnail_url}
                    sx={{ 
                      width: '100%', 
                      height: 200,
                      mb: 2
                    }}
                  >
                    {!subModuleData.thumbnail_url && 'No thumbnail'}
                  </Avatar>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                  >
                    Upload Thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                      hidden
                    />
                  </Button>
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                      />
                      <Typography variant="caption" display="block" textAlign="center">
                        {uploadProgress}% uploaded
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Recommended: 16:9 ratio, JPG/PNG/WEBP
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  PDF Resources
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Main PDF Notes
                  </Typography>
                  {subModuleData.pdf_url ? (
                    <>
                      <Button
                        component="a"
                        href={subModuleData.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        fullWidth
                        startIcon={<PictureAsPdf />}
                        sx={{ mb: 1 }}
                      >
                        View Current PDF
                      </Button>
                      <Button
                        component="label"
                        variant="text"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                      >
                        Replace PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'pdf_url')}
                          hidden
                        />
                      </Button>
                    </>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<PictureAsPdf />}
                      disabled={uploading}
                    >
                      Upload PDF Notes
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'pdf_url')}
                        hidden
                      />
                    </Button>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Additional Resources (PDF)
                  </Typography>
                  {subModuleData.additional_resources ? (
                    <>
                      <Button
                        component="a"
                        href={subModuleData.additional_resources}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        fullWidth
                        startIcon={<PictureAsPdf />}
                        sx={{ mb: 1 }}
                      >
                        View Current PDF
                      </Button>
                      <Button
                        component="label"
                        variant="text"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                      >
                        Replace PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'additional_resources')}
                          hidden
                        />
                      </Button>
                    </>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<PictureAsPdf />}
                      disabled={uploading}
                    >
                      Upload Additional PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'additional_resources')}
                        hidden
                      />
                    </Button>
                  )}
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
            {loading ? 'Saving...' : 'Save Sub-Module'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SubModuleForm;