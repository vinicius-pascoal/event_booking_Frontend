'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services';
import type { Booking } from '@/types';
import { Card, CardBody, Loading, Button, Badge } from '@/components/ui';
import { formatDate } from '@/utils';

export default function MyBookingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data.filter(b => b.userId === user?.id));
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta reserva?')) return;

    try {
      await bookingService.cancelBooking(id);
      loadBookings();
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      alert('Erro ao cancelar reserva');
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Reservas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todas as suas reservas de locais
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-gray-500 text-center py-12">
                Você ainda não tem reservas.
                <br />
                <Button className="mt-4" onClick={() => router.push('/venues')}>
                  Explorar Locais
                </Button>
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Local</p>
                          <p className="font-medium">{booking.venue?.name}</p>
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

                    {booking.status === 'confirmed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
