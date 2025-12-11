'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services';
import type { Booking } from '@/types';
import { Card, CardBody, Loading, Button, Badge } from '@/components/ui';
import { formatDate } from '@/utils';

export default function AdminBookingsPage() {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'pending'>('all');

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
      loadBookings();
    }
  }, [isAuthenticated, isAdmin]);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta reserva?')) return;

    try {
      await bookingService.deleteBooking(id);
      loadBookings();
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      alert('Erro ao deletar reserva');
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Reservas</h1>
          <p className="mt-2 text-gray-600">Visualize e gerencie todas as reservas do sistema</p>
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todas ({bookings.length})
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'primary' : 'ghost'}
            onClick={() => setFilter('confirmed')}
            size="sm"
          >
            Confirmadas ({bookings.filter(b => b.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'ghost'}
            onClick={() => setFilter('pending')}
            size="sm"
          >
            Pendentes ({bookings.filter(b => b.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'primary' : 'ghost'}
            onClick={() => setFilter('cancelled')}
            size="sm"
          >
            Canceladas ({bookings.filter(b => b.status === 'cancelled').length})
          </Button>
        </div>

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{booking.eventName}</h3>
                      <Badge
                        variant={
                          booking.status === 'confirmed'
                            ? 'success'
                            : booking.status === 'cancelled'
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {booking.status === 'confirmed'
                          ? 'Confirmada'
                          : booking.status === 'cancelled'
                            ? 'Cancelada'
                            : 'Pendente'}
                      </Badge>
                    </div>

                    {booking.description && (
                      <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Local</p>
                        <p className="font-medium">{booking.venue?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Usuário</p>
                        <p className="font-medium">{booking.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Data</p>
                        <p className="font-medium">{formatDate(booking.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Horário</p>
                        <p className="font-medium">
                          {new Date(booking.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          {filteredBookings.length === 0 && (
            <Card>
              <CardBody>
                <p className="text-gray-500 text-center py-8">
                  Nenhuma reserva encontrada com o filtro selecionado.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
