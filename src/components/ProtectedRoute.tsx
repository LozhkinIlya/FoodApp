import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CartLoader } from './CartLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <>
        <CartLoader />
        {children}
      </>
    );
  }

  return <Navigate to="/autorization" state={{ from: location }} replace />;
}
