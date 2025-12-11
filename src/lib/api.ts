// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TWICPICS_DOMAIN = process.env.NEXT_PUBLIC_TWICPICS_DOMAIN || 'https://viniciuspteste.twic.pics';

// Helper para adicionar token aos headers
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper para construir URL de imagens com TwicPics
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return '/placeholder-venue.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${TWICPICS_DOMAIN}/${imagePath}`;
};

export { API_BASE_URL, TWICPICS_DOMAIN };
