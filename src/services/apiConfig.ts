// Определяем базовый URL в зависимости от окружения
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const isDev = import.meta.env.DEV;
  
  // Прокси работает только в настоящем development режиме на localhost
  const isLocalDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  
  console.log('API Config - Environment check:', {
    hostname,
    isDev,
    isLocalDevelopment,
    userAgent: navigator.userAgent,
    location: window.location.href
  });
  
  // Только для localhost используем прокси
  if (isLocalDevelopment && isDev) {
    console.log('Using proxy URL for local development');
    return "/api/v1";
  }
  
  // Для всех остальных случаев (включая Lovable превью и production) используем прямой URL
  console.log('Using direct API URL for production/preview');
  return "https://trackhabits.ru/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

console.log('Final API_BASE_URL:', API_BASE_URL);

// Helper function for handling API responses
export const handleResponse = async (response: Response, requestInfo?: { method: string, url: string }) => {
  console.log('API Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    method: requestInfo?.method,
    headers: Object.fromEntries(response.headers.entries())
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage;
    let responseText;

    try {
      responseText = await response.text();
      console.log('Error response body:', responseText);
      
      if (contentType && contentType.includes("application/json") && responseText) {
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.error || response.statusText;
        } catch {
          errorMessage = responseText || response.statusText;
        }
      } else {
        errorMessage = responseText || response.statusText;
      }
    } catch {
      errorMessage = response.statusText;
    }

    const error = new Error(errorMessage);
    
    // Расширяем объект ошибки дополнительной информацией
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    (error as any).url = requestInfo?.url || response.url;
    (error as any).method = requestInfo?.method || 'GET';
    (error as any).responseBody = responseText;
    (error as any).timestamp = new Date().toISOString();
    
    console.error('API Error details:', {
      status: response.status,
      statusText: response.statusText,
      url: requestInfo?.url || response.url,
      method: requestInfo?.method,
      responseBody: responseText,
      errorMessage
    });
    
    throw error;
  }

  // Return true for empty responses
  if (response.status === 204) {
    return true;
  }

  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (jsonError) {
      console.warn("Не удалось распарсить JSON ответ:", jsonError);
      return await response.text();
    }
  }

  return await response.text();
};

export { API_BASE_URL };
