/**
 * API istemcisi - backend API ile iletişim için merkezi nokta
 */

// API URL'ini çevre değişkeninden alıyoruz
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204/api';

// Token local storage'dan alınır
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * API istekleri için temel fonksiyon
 */
export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // İstek headers'ı
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Eğer kimlik doğrulama gerekiyorsa token ekle
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  // Fetch isteği için options
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  // Eğer veri varsa ve metot GET değilse, body ekle
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    // JSON yanıtı dönüştür
    const responseData = await response.json();
    
    // 200-299 arası status code başarılı kabul edilir
    if (response.ok) {
      return responseData;
    }
    
    // API hata mesajını kullan veya varsayılan hata mesajı oluştur
    throw new Error(
      responseData.message || 
      responseData.title || 
      `API isteği başarısız: ${response.status}`
    );
  } catch (error) {
    console.error('API isteği sırasında hata:', error);
    throw error;
  }
}

/**
 * HTTP metotları için kolaylık fonksiyonları
 */
export const api = {
  get: <T>(endpoint: string, requiresAuth: boolean = true): Promise<T> => 
    apiRequest<T>(endpoint, 'GET', undefined, requiresAuth),
    
  post: <T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> => 
    apiRequest<T>(endpoint, 'POST', data, requiresAuth),
    
  put: <T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> => 
    apiRequest<T>(endpoint, 'PUT', data, requiresAuth),
    
  patch: <T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> => 
    apiRequest<T>(endpoint, 'PATCH', data, requiresAuth),
    
  delete: <T>(endpoint: string, requiresAuth: boolean = true): Promise<T> => 
    apiRequest<T>(endpoint, 'DELETE', undefined, requiresAuth),
}; 