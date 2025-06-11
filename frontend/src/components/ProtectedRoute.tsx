import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

interface User {
  role: 'user' | 'admin';
  // otras propiedades del usuario si las hay
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // Mejor manejo del usuario en localStorage
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
    // Usuario no autenticado
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Usuario no tiene el rol requerido
    return <Navigate to="/unauthorized" replace />;
  }
 
  return children;
};

export default ProtectedRoute;