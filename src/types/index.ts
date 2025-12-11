// Tipos principais da aplicação baseados na API do backend

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  provider: string;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  bookings?: Booking[];
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  isHighlight: boolean;
  images: string[];
  mainImage?: string;
  createdAt: string;
  updatedAt: string;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  eventName: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  venue?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface CreateVenueData {
  name: string;
  description?: string;
  location: string;
  capacity: number;
  isHighlight?: boolean;
  images?: string[];
  mainImage?: string;
}

export interface CreateBookingData {
  userId: string;
  venueId: string;
  eventName: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingData {
  status: 'confirmed' | 'cancelled' | 'pending';
}
