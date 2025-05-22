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
  FormHelperText
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SubModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [modules, setModules] = useState([]);
  const [subModuleData, setSubModuleData] = useState({
    module_id: '',
    module_title: '',
    title: '',
    level: 'Beginner',
    thumbnail_url: '',
    sub_module_content: '',
    watch_videos: '',
    pdf_note: '',
    additional_note: ''
  });

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
          }
        } catch (error) {
          console.error('Error fetching sub-module:', error);
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
    formData.append('upload_preset', 'dev-path'); // Replace with your upload preset
    formData.append('cloud_name', 'dl3mpo0w3'); // Replace with your cloud name
    
    try {
      setUploading(true);
      setUploadingField(fieldName);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dl3mpo0w3/auto/upload`, // Using auto for both images and PDFs
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${fieldName} to Cloudinary:`, error);
      throw error;
    } finally {
      setUploading(false);
      setUploadingField(null);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const downloadURL = await uploadToCloudinary(file, fieldName);
      
      setSubModuleData(prev => ({
        ...prev,
        [fieldName]: downloadURL
      }));
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
      navigate('/admin/submodules');
    } catch (error) {
      console.error('Error saving sub-module:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Sub-Module' : 'Create New Sub-Module'}
      </Typography>
      
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Module</InputLabel>
        <Select
          name="module_id"
          value={subModuleData.module_id}
          label="Module"
          onChange={handleModuleChange}
          disabled={!!id}
        >
          {modules.map((module) => (
            <MenuItem key={module.id} value={module.id}>
              {module.title} ({module.level})
            </MenuItem>
          ))}
        </Select>
        {subModuleData.module_title && (
          <FormHelperText>
            Selected Module: {subModuleData.module_title}
          </FormHelperText>
        )}
      </FormControl>
      
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={subModuleData.title}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Level</InputLabel>
        <Select
          name="level"
          value={subModuleData.level}
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
          onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
          disabled={uploading && uploadingField === 'thumbnail_url'}
        />
        {uploading && uploadingField === 'thumbnail_url' && <CircularProgress size={24} />}
        {subModuleData.thumbnail_url && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={subModuleData.thumbnail_url} 
              alt="Thumbnail preview" 
              style={{ maxWidth: '100%', maxHeight: 200 }} 
            />
          </Box>
        )}
      </Box>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content
        </Typography>
        <ReactQuill
          theme="snow"
          value={subModuleData.sub_module_content}
          onChange={handleContentChange}
          style={{ height: 300, marginBottom: 50 }}
        />
      </Box>
      
      <TextField
        fullWidth
        label="YouTube Video URL"
        name="watch_videos"
        value={subModuleData.watch_videos}
        onChange={handleChange}
        margin="normal"
        placeholder="https://www.youtube.com/watch?v=..."
      />
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          PDF Note
        </Typography>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileUpload(e, 'pdf_note')}
          disabled={uploading && uploadingField === 'pdf_note'}
        />
        {uploading && uploadingField === 'pdf_note' && <CircularProgress size={24} />}
        {subModuleData.pdf_note && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Current file: <a href={subModuleData.pdf_note} target="_blank" rel="noopener noreferrer">View PDF</a>
          </Typography>
        )}
      </Box>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Additional Note (PDF)
        </Typography>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileUpload(e, 'additional_note')}
          disabled={uploading && uploadingField === 'additional_note'}
        />
        {uploading && uploadingField === 'additional_note' && <CircularProgress size={24} />}
        {subModuleData.additional_note && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Current file: <a href={subModuleData.additional_note} target="_blank" rel="noopener noreferrer">View PDF</a>
          </Typography>
        )}
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || uploading}
        >
          {loading ? 'Saving...' : 'Save Sub-Module'}
        </Button>
      </Box>
    </Box>
  );
};

export default SubModuleForm;