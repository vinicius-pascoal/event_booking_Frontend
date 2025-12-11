import { API_BASE_URL } from '@/lib/api';
import type { Event } from '@/types';

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Falha ao buscar eventos');
    return response.json();
  },

  async getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) throw new Error('Falha ao buscar evento');
    return response.json();
  },

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Falha ao criar evento');
    return response.json();
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Falha ao atualizar evento');
    return response.json();
  },

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao deletar evento');
  },
};
