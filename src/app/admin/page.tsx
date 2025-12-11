'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { venueService, bookingService, userService } from '@/services';
import { Card, CardBody, Loading } from '@/components/ui';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    totalUsers: 0,
    activeBookings: 0,
  });
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
      loadStats();
    }
  }, [isAuthenticated, isAdmin]);

  const loadStats = async () => {
    try {
      const [venues, bookings, users] = await Promise.all([
        venueService.getVenues(),
        bookingService.getBookings(),
        userService.getUsers(),
      ]);

      setStats({
        totalVenues: venues.length,
        totalBookings: bookings.length,
        totalUsers: users.length,
        activeBookings: bookings.filter(b => b.status === 'confirmed').length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="mt-2 text-gray-600">Gerencie locais, reservas e usuários</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Locais</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalVenues}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Reservas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalBookings}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Reservas Ativas</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.activeBookings}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Usuários</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalUsers}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/venues">
            <Card hover>
              <CardBody>
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold mb-2">Gerenciar Locais</h3>
                  <p className="text-gray-600 text-sm">Criar, editar e remover locais</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/bookings">
            <Card hover>
              <CardBody>
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">Gerenciar Reservas</h3>
                  <p className="text-gray-600 text-sm">Visualizar e gerenciar todas as reservas</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card hover>
              <CardBody>
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold mb-2">Gerenciar Usuários</h3>
                  <p className="text-gray-600 text-sm">Visualizar e gerenciar usuários</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
