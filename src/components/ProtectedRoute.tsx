import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, hasUser } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (!hasUser) {
    return <Navigate to="/registration" state={{ from: location }} replace />;
  }

  return <Navigate to="/autorization" state={{ from: location }} replace />;
}
