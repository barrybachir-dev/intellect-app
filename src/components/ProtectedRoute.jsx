import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

export function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useAppContext();
  const location = useLocation();

  if (authLoading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Chargement...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
