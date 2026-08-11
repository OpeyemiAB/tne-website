import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGifting } from '../context/GiftingContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useGifting();

  if (!currentUser || currentUser.status === 'Revoked') {
    return <Navigate to="/admin-login" replace />;
  }

  const role = (currentUser.role || '').toLowerCase();
  const isAllowed = role.includes('admin') || role.includes('staff');

  if (!isAllowed) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
