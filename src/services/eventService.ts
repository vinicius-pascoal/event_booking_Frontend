import { API_BASE_URL, getAuthHeaders } from '@/lib/api';
import type { Venue, CreateVenueData } from '@/types';

export const venueService = {
  async getVenues(): Promise<Venue[]> {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar locais');
    return response.json();
  },

  async getHighlights(): Promise<Venue[]> {
    const response = await fetch(`${API_BASE_URL}/venues/highlights`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar locais em destaque');
    return response.json();
  },

  async getVenueById(id: string): Promise<Venue> {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar local');
    return response.json();
  },

  async createVenue(venue: CreateVenueData): Promise<Venue> {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(venue),
    });
    if (!response.ok) throw new Error('Falha ao criar local');
    return response.json();
  },

  async updateVenue(id: string, venue: Partial<CreateVenueData>): Promise<Venue> {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(venue),
    });
    if (!response.ok) throw new Error('Falha ao atualizar local');
    return response.json();
  },

  async deleteVenue(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao deletar local');
  },
};
