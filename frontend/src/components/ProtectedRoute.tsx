import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

interface User {
  role: 'user' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  let user: User | null = null;
  try {
    const userData = localStorage.getItem('user');
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data', error);
    user = null;
  }

  const token = localStorage.getItem('token');

  if (!token || !user) {

    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {

    return <Navigate to="/unauthorized" replace />;
  }
 
  return children;
};

export default ProtectedRoute;