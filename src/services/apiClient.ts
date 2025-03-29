/**
 * API istemcisi - backend API ile iletişim için merkezi nokta
 */

// API URL'ini çevre değişkeninden alıyoruz
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204';

// Token local storage'dan alınır
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// API hata yanıtını işleme fonksiyonu
const processApiError = (responseData: any): string => {
  // API hata mesajını kullan veya varsayılan hata mesajı oluştur
  if (responseData?.message) {
    return responseData.message;
  }
  
  // Eğer API errors dizisi döndüyse, ilk hata mesajını al
  if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    const firstError = responseData.errors[0];
    if (firstError.errorMessages && Array.isArray(firstError.errorMessages) && firstError.errorMessages.length > 0) {
      return firstError.errorMessages[0];
    }
    
    if (firstError.message) {
      return firstError.message;
    }
  }
  
  return "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
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
    'Accept': 'application/json'
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
    mode: 'cors'
  };
  
  // Eğer veri varsa ve metot GET değilse, body ekle
  if (data && method !== 'GET') {
    // DEBUG: İsteğin body'sini ve tam URL'i göster
    console.log(`${method} ${url}`);
    console.log(`Request body for ${endpoint}:`, JSON.stringify(data, null, 2));
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log(`Making ${method} request to: ${url}`);
    const response = await fetch(url, options);
    
    // Log status and URL for debugging
    console.log(`Response status: ${response.status} for ${url}`);
    
    // No content responses (204, 205) won't have JSON
    if (response.status === 204 || response.status === 205) {
      return {} as T;
    }
    
    // Attempt to get JSON response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
        // DEBUG: API yanıtını logla (hata ayıklamak için)
        console.log(`Response data for ${endpoint}:`, JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log('Response is not valid JSON, returning empty object');
        responseData = {};
      }
    } else {
      console.log(`Response is not JSON (content-type: ${contentType}), returning empty object`);
      responseData = {};
    }
    
    // 200-299 arası status code başarılı kabul edilir
    if (response.ok) {
      return responseData;
    }
    
    // API hata mesajını işle
    const errorMessage = processApiError(responseData);
    
    console.error('API error details:', {
      url,
      method,
      status: response.status,
      statusText: response.statusText,
      requestBody: data ? JSON.stringify(data) : null,
      responseData: JSON.stringify(responseData)
    });
    
    throw new Error(errorMessage);
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
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