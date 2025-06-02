import { Navigate, useLocation } from 'react-router-dom';
import { getAuthState, isUserAuthenticated } from '../../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { role } = getAuthState();
  
  // Use improved authentication check that validates token expiration
  const authenticated = isUserAuthenticated();

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role-based access is required and user's role is not allowed
  if (allowedRoles && role) {
    // Make role checking case-insensitive
    const userRole = role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
} 