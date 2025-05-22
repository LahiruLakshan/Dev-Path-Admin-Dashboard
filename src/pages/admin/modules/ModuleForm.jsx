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
  CircularProgress 
} from '@mui/material';

const ModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [moduleData, setModuleData] = useState({
    title: '',
    level: 'Beginner',
    thumbnail_url: ''
  });

  useEffect(() => {
    if (id) {
      const fetchModule = async () => {
        try {
          setLoading(true);
          const docRef = doc(db, 'modules', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setModuleData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching module:', error);
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
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'dev-path'); // Replace with your upload preset
      formData.append('cloud_name', 'dl3mpo0w3'); // Replace with your cloud name
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dl3mpo0w3/image/upload`, // Replace with your cloud name
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      console.log("data url: ", data);
      
      
      setModuleData(prev => ({
        ...prev,
        thumbnail_url: data.secure_url
      }));
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("moduleData : ", moduleData);
      
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
      navigate('/admin/modules');
    } catch (error) {
      console.error('Error saving module:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Module' : 'Create New Module'}
      </Typography>
      
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={moduleData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Level</InputLabel>
        <Select
          name="level"
          value={moduleData.level}
          label="Level"
          onChange={handleChange}
          required
        >
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thumbnail Image
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <CircularProgress size={24} />}
        {moduleData.thumbnail_url && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={moduleData.thumbnail_url} 
              alt="Thumbnail preview" 
              style={{ maxWidth: '100%', maxHeight: 200 }} 
            />
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || uploading}
        >
          {loading ? 'Saving...' : 'Save Module'}
        </Button>
      </Box>
    </Box>
  );
};

export default ModuleForm;