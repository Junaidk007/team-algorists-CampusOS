import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'faculty' | 'club' | 'student' | 'dean' | 'organizer' | 'attendee')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show centered premium loader if auth verification is still checking cookies/local storage
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-3">
        <Spinner className="w-8 h-8 text-primary" />
        <span className="text-xs text-muted-foreground animate-pulse font-medium tracking-wide">
          Verifying Console Session...
        </span>
      </div>
    );
  }

  // Redirect to login if user session is absent
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is authorized to access the specific layout/feature
  if (allowedRoles) {
    const effectiveRole = user.role;
    const isAuthorized = allowedRoles.includes(effectiveRole) || 
      (allowedRoles.includes('organizer') && (effectiveRole === 'faculty' || effectiveRole === 'club' || effectiveRole === 'dean')) ||
      (allowedRoles.includes('attendee') && effectiveRole === 'student');

    if (!isAuthorized) {
      console.warn(`Unauthorized role: ${user.role} tried to access route.`);
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
export { ProtectedRoute };
