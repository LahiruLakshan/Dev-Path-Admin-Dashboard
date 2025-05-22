// src/pages/auth/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import {useAuthStore} from '../../stores/authStore';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: 'Beginner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // // 2. Update user profile with display name
      // await updateProfile(userCredential.user, {
      //   displayName: formData.name
      // });

      // 3. Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
        type: 'Admin', // Hardcoded as Admin for this signup
        level: formData.level,
        createdAt: new Date()
      });

      // 4. Update Zustand store
      setUser(userCredential.user);

      // 5. Redirect to admin dashboard
      navigate('/admin/modules');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Sign Up
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            helperText="At least 6 characters"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Skill Level</InputLabel>
            <Select
              name="level"
              value={formData.level}
              label="Skill Level"
              onChange={handleChange}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Log In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;