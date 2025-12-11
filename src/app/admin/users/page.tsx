'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { userService } from '@/services';
import type { User } from '@/types';
import { Card, CardBody, Loading, Button, Badge } from '@/components/ui';
import { formatDate } from '@/utils';

export default function AdminUsersPage() {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadUsers();
    }
  }, [isAuthenticated, isAdmin]);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este usuário?')) return;

    try {
      await userService.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="mt-2 text-gray-600">Visualize e gerencie todos os usuários do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  {user.isAdmin && <Badge variant="info">Admin</Badge>}
                </div>

                <p className="text-gray-600 text-sm mb-2">📧 {user.email}</p>
                <p className="text-gray-500 text-sm mb-2">
                  Cadastrado em: {formatDate(user.createdAt)}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Reservas: {user.bookings?.length || 0}
                </p>

                {!user.isAdmin && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                    fullWidth
                  >
                    Deletar
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card>
            <CardBody>
              <p className="text-gray-500 text-center py-12">
                Nenhum usuário encontrado.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
