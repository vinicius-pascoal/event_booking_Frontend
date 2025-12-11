import { API_BASE_URL } from '@/lib/api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao registrar usuário');
    }

    const authData: AuthResponse = await response.json();

    // Armazena token e refreshToken
    localStorage.setItem('token', authData.token);
    localStorage.setItem('refreshToken', authData.refreshToken);

    return authData;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciais inválidas');
    }

    const authData: AuthResponse = await response.json();

    // Armazena token e refreshToken
    localStorage.setItem('token', authData.token);
    localStorage.setItem('refreshToken', authData.refreshToken);

    return authData;
  },

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar token');
    }

    const tokens = await response.json();

    // Atualiza tokens
    localStorage.setItem('token', tokens.token);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
  },

  async getMe(): Promise<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar dados do usuário');
    }

    return response.json();
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
