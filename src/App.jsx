// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login';
import Profile from './pages/admin/Profile';
import ModuleList from './pages/admin/modules/ModuleList';
import ModuleForm from './pages/admin/modules/ModuleForm';
import SubModuleList from './pages/admin/submodules/SubModuleList';
import SubModuleForm from './pages/admin/submodules/SubModuleForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Signup from './pages/auth/Signup';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/modules" element={<ModuleList />} />
              <Route path="/admin/modules/new" element={<ModuleForm />} />
              <Route path="/admin/modules/edit/:id" element={<ModuleForm />} />
              <Route path="/admin/submodules" element={<SubModuleList />} />
              <Route path="/admin/submodules/new" element={<SubModuleForm />} />
              <Route path="/admin/submodules/edit/:id" element={<SubModuleForm />} />
              <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;