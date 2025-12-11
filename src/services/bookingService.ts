import { API_BASE_URL, getAuthHeaders } from '@/lib/api';
import type { Booking, CreateBookingData, UpdateBookingData } from '@/types';

export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar reservas');
    return response.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar reserva');
    return response.json();
  },

  async createBooking(booking: CreateBookingData): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao criar reserva');
    }

    return response.json();
  },

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao atualizar reserva');
    return response.json();
  },

  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (!response.ok) throw new Error('Falha ao cancelar reserva');
  },

  async deleteBooking(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao deletar reserva');
  },
};
