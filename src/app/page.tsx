'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/ui';

export default function Home() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Redireciona baseado no tipo de usuário
        router.push(isAdmin ? '/admin' : '/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="lg" />
    </div>
  );
}
