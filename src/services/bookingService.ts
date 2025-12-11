import { API_BASE_URL } from '@/lib/api';
import type { Booking } from '@/types';

export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error('Falha ao buscar reservas');
    return response.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    if (!response.ok) throw new Error('Falha ao buscar reserva');
    return response.json();
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Falha ao criar reserva');
    return response.json();
  },

  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Falha ao cancelar reserva');
  },
};
