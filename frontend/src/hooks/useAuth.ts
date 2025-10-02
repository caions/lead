'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true
  });

  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
    
    router.push('/admin/login');
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user,
          token,
          loading: false
        });
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        logout();
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      });
    }
  }, [logout]);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      user,
      token,
      loading: false
    });
  };

  const requireAuth = () => {
    if (!authState.loading && !authState.isAuthenticated) {
      router.push('/admin/login');
      return false;
    }
    return authState.isAuthenticated;
  };

  return {
    ...authState,
    login,
    logout,
    requireAuth
  };
}
