
import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, Role } from '../types.ts';

interface ProtectedRouteProps {
  user: User | null;
  requiredRole?: Role;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, requiredRole, children }) => {
  // 1. If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, allow access
  return children;
};

export default ProtectedRoute;
