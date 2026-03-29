"use client";

import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from './LoginForm';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-b-4 border-purple-500 animate-pulse mx-auto"></div>
          </div>
          <p className="text-cyan-300 font-mono text-sm tracking-wider">VERIFICANDO AUTENTICAÇÃO...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
}