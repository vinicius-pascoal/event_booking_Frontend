'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { venueService } from '@/services';
import type { Venue, CreateVenueData } from '@/types';
import { Card, CardBody, Loading, Button, Input, Textarea, Modal, Badge } from '@/components/ui';

export default function AdminVenuesPage() {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<CreateVenueData>({
    name: '',
    description: '',
    location: '',
    capacity: 0,
    isHighlight: false,
    images: [],
    mainImage: '',
  });

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
      loadVenues();
    }
  }, [isAuthenticated, isAdmin]);

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

  const handleSubmit = async () => {
    try {
      if (editingVenue) {
        await venueService.updateVenue(editingVenue.id, formData);
      } else {
        await venueService.createVenue(formData);
      }
      setShowModal(false);
      setEditingVenue(null);
      resetForm();
      loadVenues();
    } catch (error) {
      console.error('Erro ao salvar local:', error);
      alert('Erro ao salvar local');
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      description: venue.description || '',
      location: venue.location,
      capacity: venue.capacity,
      isHighlight: venue.isHighlight,
      images: venue.images,
      mainImage: venue.mainImage || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este local?')) return;

    try {
      await venueService.deleteVenue(id);
      loadVenues();
    } catch (error) {
      console.error('Erro ao deletar local:', error);
      alert('Erro ao deletar local');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      capacity: 0,
      isHighlight: false,
      images: [],
      mainImage: '',
    });
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Locais</h1>
            <p className="mt-2 text-gray-600">Adicione, edite ou remova locais</p>
          </div>
          <Button onClick={() => { resetForm(); setEditingVenue(null); setShowModal(true); }}>
            + Novo Local
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{venue.name}</h3>
                  {venue.isHighlight && <Badge variant="info">Destaque</Badge>}
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{venue.description}</p>
                <p className="text-gray-500 text-sm mb-2">📍 {venue.location}</p>
                <p className="text-gray-500 text-sm mb-4">👥 {venue.capacity} pessoas</p>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(venue)} fullWidth>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(venue.id)} fullWidth>
                    Deletar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingVenue(null); }}
          title={editingVenue ? 'Editar Local' : 'Novo Local'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => { setShowModal(false); setEditingVenue(null); }}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingVenue ? 'Atualizar' : 'Criar'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nome do Local"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <Textarea
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              fullWidth
            />

            <Input
              label="Localização"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              fullWidth
            />

            <Input
              type="number"
              label="Capacidade"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
              fullWidth
            />

            <Input
              label="Imagem Principal (nome do arquivo)"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              placeholder="venue-main.jpg"
              fullWidth
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isHighlight"
                checked={formData.isHighlight}
                onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isHighlight" className="text-sm font-medium">
                Destacar este local na página inicial
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
