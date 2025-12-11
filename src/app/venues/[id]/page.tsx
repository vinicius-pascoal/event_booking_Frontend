'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { venueService, bookingService } from '@/services';
import type { Venue, CreateBookingData } from '@/types';
import { Card, CardBody, CardHeader, Loading, Button, Input, Textarea, Modal } from '@/components/ui';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    eventName: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      loadVenue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id]);

  const loadVenue = async () => {
    try {
      const data = await venueService.getVenueById(params.id as string);
      setVenue(data);
    } catch (error) {
      console.error('Erro ao carregar local:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user || !venue) return;

    setError('');
    setSubmitting(true);

    try {
      const data: CreateBookingData = {
        userId: user.id,
        venueId: venue.id,
        eventName: bookingData.eventName,
        description: bookingData.description,
        date: new Date(bookingData.date).toISOString(),
        startTime: new Date(`${bookingData.date}T${bookingData.startTime}`).toISOString(),
        endTime: new Date(`${bookingData.date}T${bookingData.endTime}`).toISOString(),
      };

      await bookingService.createBooking(data);
      alert('Reserva criada com sucesso!');
      setShowBookingModal(false);
      router.push('/my-bookings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar reserva');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!venue) {
    return <div className="min-h-screen flex items-center justify-center">Local não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="relative h-96 bg-gray-200">
                {venue.mainImage && (
                  <Image
                    src={getImageUrl(venue.mainImage)}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardBody>
                <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
                <p className="text-gray-600 mb-4">{venue.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Localização</p>
                    <p className="font-medium">📍 {venue.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacidade</p>
                    <p className="font-medium">👥 {venue.capacity} pessoas</p>
                  </div>
                </div>

                {venue.images && venue.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {venue.images.slice(0, 3).map((img, idx) => (
                      <div key={idx} className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(img)}
                          alt={`${venue.name} - ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Fazer Reserva</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-4">
                  Reserve este local para o seu evento
                </p>
                <Button fullWidth onClick={() => setShowBookingModal(true)}>
                  Reservar Agora
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>

        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Criar Reserva"
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowBookingModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleBooking} disabled={submitting}>
                {submitting ? 'Reservando...' : 'Confirmar Reserva'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Nome do Evento"
              value={bookingData.eventName}
              onChange={(e) => setBookingData({ ...bookingData, eventName: e.target.value })}
              required
              fullWidth
            />

            <Textarea
              label="Descrição (opcional)"
              value={bookingData.description}
              onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
              rows={3}
              fullWidth
            />

            <Input
              type="date"
              label="Data do Evento"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              required
              fullWidth
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                label="Horário de Início"
                value={bookingData.startTime}
                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                required
                fullWidth
              />

              <Input
                type="time"
                label="Horário de Término"
                value={bookingData.endTime}
                onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                required
                fullWidth
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
