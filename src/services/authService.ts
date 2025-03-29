// Simplified authentication service for demo purposes
// In a real app, this would connect to a backend API

import { api } from './apiClient';

// Abonelik tipi tanımı
export interface Subscription {
  planId: string;
  transactionId: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  name?: string;
  questionCredits?: number;
  subscription?: Subscription;
}

// Extended interface for mock users with password
interface MockUser extends User {
  password: string;
}

export interface LoginCredentials {
  Email: string;
  Password: string;
  RememberMe?: boolean;
}

export interface RegisterCredentials {
  Email: string;
  Password: string;
  FullName: string;
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
const saveToken = (token: string, rememberMe: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  // Use sessionStorage for temporary session, localStorage for "remember me"
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('auth_token', token);
};

// User'ı local storage'a kaydet
const saveUserToStorage = (user: User, rememberMe: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  // Use sessionStorage for temporary session, localStorage for "remember me"
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
};

// User'ı local storage'dan al
const getUserFromStorage = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    // First check localStorage, then sessionStorage
    let userJson = localStorage.getItem('user');
    
    if (!userJson) {
      userJson = sessionStorage.getItem('user');
    }
    
    // userJson null, undefined veya boş string ise null dön
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    // JSON parse hatası olursa storage'ı temizle ve null dön
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return null;
  }
};

// Token'ı ve user'ı local storage'dan sil
const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('user');
};

// Login
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // API istek formatını düzenle
    const requestData = {
      Email: credentials.Email,
      Password: credentials.Password,
      RememberMe: credentials.RememberMe
    };
    
    console.log('Login request data:', JSON.stringify(requestData, null, 2));
    
    // API yanıtının yapısına dikkat edin
    const response = await api.post<{
      isSuccess: boolean;
      message: string;
      data: AuthLoginDto;
      errors?: Array<{propertyName: string, errorMessages: string[]}>
    }>('api/auth/login', requestData, false);
    
    console.log('Login response:', response);
    
    // API yanıtını kontrol et
    if (!response.data) {
      let errorMessage = response.message || "Giriş başarısız";
      
      // Eğer detaylı hata mesajları varsa, ilkini ekleyelim
      if (response.errors && response.errors.length > 0) {
        const firstError = response.errors[0];
        if (firstError.errorMessages && firstError.errorMessages.length > 0) {
          errorMessage += `: ${firstError.errorMessages[0]}`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const { token, expiresAt, user } = response.data;
    
    // Token ve kullanıcı bilgilerini kaydet
    saveToken(token, credentials.RememberMe);
    saveUserToStorage(user, credentials.RememberMe);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    // Ad soyad, email ve şifre zorunludur, boş değer kontrolü yapalım
    if (!credentials.FullName?.trim()) {
      throw new Error("Ad ve soyad gereklidir.");
    }
    
    if (!credentials.Email?.trim()) {
      throw new Error("E-posta adresi gereklidir.");
    }
    
    if (!credentials.Password?.trim()) {
      throw new Error("Şifre gereklidir.");
    }
    
    // API istek formatı - validasyonlar için değerleri mutlaka string olarak gönderelim
    const requestPayload = {
      request: {
        Email: credentials.Email.trim(),
        Password: credentials.Password.trim(),
        FullName: credentials.FullName.trim()
      }
    };
    
    console.log('Register request data:', JSON.stringify(requestPayload, null, 2));
    
    try {
      const response = await api.post<{
        isSuccess: boolean;
        message: string;
        data: RegisterResponse | null;
        errors?: Array<{propertyName: string, errorMessages: string[]}>
      }>('api/auth/register', requestPayload, false);

      console.log('Register response:', JSON.stringify(response, null, 2));

      // API yanıtını kontrol et
      if (!response.data) {
        // Hata mesajları
        let errorMessage = response.message || "Kayıt işlemi başarısız";
        
        if (response.errors && response.errors.length > 0) {
          const errorDetails = response.errors.map(err => 
            `${err.propertyName}: ${err.errorMessages?.join(', ') || 'Bilinmeyen hata'}`
          ).join(' | ');
          
          errorMessage += `: ${errorDetails}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Token ve kullanıcı bilgilerini kaydet
      if (response.data.token) {
        saveToken(response.data.token);
      }
      
      if (response.data.user) {
        saveUserToStorage(response.data.user);
        return response.data.user;
      }
      
      throw new Error("Kullanıcı bilgileri alınamadı");
    } catch (apiError) {
      console.error('API error during registration:', apiError);
      throw apiError;
    }
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

// Kullanıcı abonelik durumunu güncelle
export function updateUserSubscription(planId: string, transactionId: string): boolean {
  try {
    // Mevcut kullanıcı bilgisini al
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('Kullanıcı bulunamadı');
      return false;
    }
    
    // Planın detaylarını belirle
    let subscriptionEndDate: Date;
    let questionCredits = 0;
    const now = new Date();
    
    switch (planId) {
      case 'basic':
        // Temel plan: 1 ay + 50 soru
        subscriptionEndDate = new Date(now.setMonth(now.getMonth() + 1));
        questionCredits = 50;
        break;
      case 'premium':
        // Premium plan: 1 ay + 200 soru
        subscriptionEndDate = new Date(now.setMonth(now.getMonth() + 1));
        questionCredits = 200;
        break;
      case 'yearly':
        // Yıllık plan: 1 yıl + sınırsız soru
        subscriptionEndDate = new Date(now.setFullYear(now.getFullYear() + 1));
        questionCredits = 999999; // "Sınırsız" için yüksek bir değer
        break;
      default:
        console.error('Geçersiz plan ID', planId);
        return false;
    }
    
    // Kullanıcı bilgilerini güncelle
    const updatedUser = {
      ...currentUser,
      subscription: {
        planId,
        transactionId,
        startDate: new Date().toISOString(),
        endDate: subscriptionEndDate.toISOString(),
        status: 'active'
      },
      questionCredits,
      // Diğer abonelik özellikleri burada eklenebilir
    };
    
    // localStorage'da kullanıcı bilgilerini güncelle
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    console.log('Kullanıcı aboneliği güncellendi:', updatedUser);
    return true;
  } catch (error) {
    console.error('Kullanıcı aboneliği güncellenirken hata oluştu:', error);
    return false;
  }
}

// Şifre sıfırlama için arayüz
export interface ForgotPasswordRequest {
  Email: string;
}

export interface ResetPasswordRequest {
  Token: string;
  NewPassword: string;
}

// Şifre sıfırlama isteği gönder
export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    // API istek formatını düzenle
    const requestData = {
      request: {
        Email: email
      }
    };
    
    console.log('Forgot password request data:', JSON.stringify(requestData, null, 2));
    
    // API'ye şifre sıfırlama isteği gönder
    const response = await api.post<{ 
      isSuccess: boolean, 
      message: string,
      errors?: Array<{propertyName: string, errorMessages: string[]}>
    }>(
      'api/auth/forgot-password', 
      requestData,
      false
    );
    
    console.log('Forgot password response:', response);
    
    // Disregard isSuccess check as we did with login and register
    return true;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// Şifre sıfırlama işlemini tamamla
export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  try {
    // API istek formatını düzenle
    const requestData = {
      request: {
        Token: token,
        NewPassword: newPassword
      }
    };
    
    console.log('Reset password request data:', JSON.stringify(requestData, null, 2));
    
    // API'ye yeni şifre gönder
    const response = await api.post<{ 
      isSuccess: boolean, 
      message: string,
      errors?: Array<{propertyName: string, errorMessages: string[]}>
    }>(
      'api/auth/reset-password',
      requestData,
      false
    );
    
    console.log('Reset password response:', response);
    
    // Disregard isSuccess check as we did with login and register
    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}; 