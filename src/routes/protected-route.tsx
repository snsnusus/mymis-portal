import { type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/contexts/auth.context';
import { ProgressBar } from '~/components/ui/progress-bar';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): ReactElement => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <ProgressBar />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
