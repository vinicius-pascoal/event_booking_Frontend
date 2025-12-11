import { API_BASE_URL, getAuthHeaders } from '@/lib/api';
import type { User } from '@/types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar usuários');
    return response.json();
  },

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao buscar usuário');
    return response.json();
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Falha ao atualizar usuário');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Falha ao deletar usuário');
  },
};
