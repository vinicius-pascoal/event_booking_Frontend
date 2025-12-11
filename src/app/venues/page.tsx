'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { venueService } from '@/services';
import type { Venue } from '@/types';
import { Card, CardBody, Loading, Button } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

export default function VenuesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadVenues();
    }
  }, [isAuthenticated]);

  const loadVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Locais Disponíveis</h1>
          <p className="mt-2 text-gray-600">
            Escolha um local para realizar seu evento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} hover>
              <div className="relative h-48 bg-gray-200">
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
                <h3 className="font-semibold text-xl mb-2">{venue.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {venue.description}
                </p>
                <p className="text-gray-500 text-sm mb-2">📍 {venue.location}</p>
                <p className="text-gray-500 text-sm mb-4">
                  👥 Capacidade: {venue.capacity} pessoas
                </p>
                <Link href={`/venues/${venue.id}`}>
                  <Button fullWidth>
                    Ver Detalhes e Reservar
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
