// src/pages/admin/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import {useAuthStore} from '../../stores/authStore';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  Avatar,
  Paper
} from '@mui/material';

const Profile = () => {
    const navigate = useNavigate();
  
  const { currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    level: 'Beginner'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), profileData);
      // Show success message or redirect
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
      // Zustand store will handle the rest via listener
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={profileData.photoURL || ''}
          />
        </Box>
        
        <TextField
          label="Name"
          name="name"
          value={profileData.name || ''}
          onChange={handleChange}
          required
        />
        
        <TextField
          label="Email"
          name="email"
          type="email"
          value={profileData.email || ''}
          onChange={handleChange}
          required
          disabled
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Update Profile
        </Button>
        
        <Button 
          variant="outlined" 
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default Profile;