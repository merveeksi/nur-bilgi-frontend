// Simplified authentication service for demo purposes
// In a real app, this would connect to a backend API

import { api } from './apiClient';

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  name?: string;
}

// Extended interface for mock users with password
interface MockUser extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

// Define the missing AuthLoginDto interface
interface AuthLoginDto {
  token: string;
  expiresAt: string;
  user: User;
}

// Mock user data for demo
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'merveeksi',
    name: 'Merve Eksi',
    password: '123Merve123!!',
    email: 'merve@eksi.com',
  },
  {
    id: '2',
    username: 'alpgiray',
    name: 'Alp Giray',
    password: '123Alp123!!',
    email: 'alp@ustun.com',
  },
  {
    id: '3',
    username: 'admin',
    name: 'Admin',
    password: 'Admin123!',
    email: 'admin@nurbilgi.com',
  },
];

// Token'ı local storage'a kaydet
const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

// User'ı local storage'a kaydet
const saveUserToStorage = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

// User'ı local storage'dan al
const getUserFromStorage = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const userJson = localStorage.getItem('user');
    
    // userJson null, undefined veya boş string ise null dön
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    // JSON parse hatası olursa localStorage'ı temizle ve null dön
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

// Token'ı ve user'ı local storage'dan sil
const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

// Login
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // API yanıtının yapısına dikkat edin
    const response = await api.post<{
      isSuccess: boolean;
      message: string;
      data: AuthLoginDto;
    }>('/auth/login', credentials, false);
    
    // If data and token exist, consider it successful regardless of isSuccess flag
    if (!response || !response.data || !response.data.token || !response.data.user) {
      throw new Error(response?.message || "Giriş başarısız");
    }
    
    const { token, expiresAt, user } = response.data;
    
    // Token ve kullanıcı bilgilerini kaydet
    saveToken(token);
    saveUserToStorage(user);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const registerData = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password
    };
    
    const response = await api.post<RegisterResponse>('/auth/register', registerData, false);
    
    // Token ve kullanıcı bilgilerini kaydet
    saveToken(response.token);
    saveUserToStorage(response.user);
    
    return response.user;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    // Backend'e logout isteği gönder (varsa)
    // await api.post('/auth/logout', {});
    
    // Local storage'ı temizle
    clearStorage();
  } catch (error) {
    console.error('Logout error:', error);
    // Hata olsa bile local storage'ı temizle
    clearStorage();
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return getUserFromStorage();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    const user = getUserFromStorage();
    return !!user; // user null değilse true döner
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
  
  const token = localStorage.getItem('auth_token');
  return !!token && !!getUserFromStorage();
}; 