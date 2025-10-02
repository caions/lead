'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  fallback = <LoadingSpinner /> 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, requireAuth } = useAuth();

  useEffect(() => {
    if (!loading) {
      requireAuth();
    }
  }, [loading, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {fallback}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
