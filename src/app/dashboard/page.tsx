'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { venueService, bookingService } from '@/services';
import type { Venue, Booking } from '@/types';
import { Card, CardBody, Loading, Badge } from '@/components/ui';
import Link from 'next/link';
import { formatDate } from '@/utils';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [highlights, setHighlights] = useState<Venue[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [highlightsData, bookingsData] = await Promise.all([
        venueService.getHighlights(),
        bookingService.getBookings(),
      ]);

      setHighlights(highlightsData.slice(0, 3));
      setMyBookings(bookingsData.filter(b => b.userId === user?.id).slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Confira os locais em destaque e suas reservas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Reservas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {myBookings.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Reservas Ativas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {myBookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Próximas Reservas</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {myBookings.filter(b => new Date(b.date) > new Date() && b.status === 'confirmed').length}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Locais em Destaque</h2>
              <Link href="/venues" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {highlights.map((venue) => (
                <Card key={venue.id} hover>
                  <CardBody>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{venue.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{venue.location}</p>
                        <p className="text-gray-500 text-sm mt-2">Capacidade: {venue.capacity} pessoas</p>
                      </div>
                      <Link href={`/venues/${venue.id}`}>
                        <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Ver detalhes →
                        </span>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Reservas Recentes</h2>
              <Link href="/my-bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {myBookings.length === 0 ? (
                <Card>
                  <CardBody>
                    <p className="text-gray-500 text-center py-8">
                      Você ainda não tem reservas.
                      <br />
                      <Link href="/venues" className="text-blue-600 hover:text-blue-700 font-medium">
                        Faça sua primeira reserva
                      </Link>
                    </p>
                  </CardBody>
                </Card>
              ) : (
                myBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardBody>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.eventName}</h3>
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
                          <p className="text-gray-600 text-sm mt-1">{booking.venue?.name}</p>
                          <p className="text-gray-500 text-sm mt-1">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
