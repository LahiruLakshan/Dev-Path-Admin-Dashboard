// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuthStore} from '../../stores/authStore';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Additional check for admin role if needed
  // if (currentUser.type !== 'Admin') {
  //   return <Navigate to="/login" />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;