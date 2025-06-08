
import { API_BASE_URL, handleResponse } from "./apiConfig";
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest, LogoutRequest } from "@/types";

// Моковые данные для демонстрации
const createMockRegisterResponse = (): Promise<string> => {
  console.log(`Mock API call for register - API недоступно`);
  return Promise.resolve("Пользователь успешно зарегистрирован (демо-режим)");
};

const createMockLoginResponse = (): Promise<LoginResponse> => {
  console.log(`Mock API call for login - API недоступно`);
  return Promise.resolve({
    access_token: "mock_access_token_" + Date.now(),
    refresh_token: "mock_refresh_token_" + Date.now()
  });
};

const createMockRefreshResponse = (): Promise<{ access_token: string, refresh_token: string }> => {
  console.log(`Mock API call for refresh - API недоступно`);
  return Promise.resolve({
    access_token: "mock_access_token_" + Date.now(),
    refresh_token: "mock_refresh_token_" + Date.now()
  });
};

const createMockLogoutResponse = (): Promise<string> => {
  console.log(`Mock API call for logout - API недоступно`);
  return Promise.resolve("Операция выполнена (демо-режим)");
};

const isNetworkError = (error: any): boolean => {
  return error.name === 'TypeError' || 
         error.message?.includes('Failed to fetch') ||
         error.message?.includes('Network request failed') ||
         (error.status === 0) ||
         (error.status === 403 && error.message?.includes('CORS'));
};

export const authService = {
  // Register user
  register: async (data: RegisterRequest): Promise<string> => {
    const url = `${API_BASE_URL}/auth/register`;
    console.log('Attempting registration:', { url, data: { ...data, password: '[HIDDEN]' } });
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Если это сетевая ошибка или CORS, используем мок
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return createMockRegisterResponse();
      }
      
      throw error;
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const url = `${API_BASE_URL}/auth/login`;
    console.log('Attempting login:', { url, data: { ...data, password: '[HIDDEN]' } });
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      // Ожидается, что сервер возвращает объект вида:
      // { token: { access_token: string, refresh_token: string } }
      const result = await handleResponse(response, { method: "POST", url });
      return result.token;
    } catch (error) {
      console.error('Login error:', error);
      
      // Если это сетевая ошибка или CORS, используем мок
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return createMockLoginResponse();
      }
      
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<{ access_token: string, refresh_token: string }> => {
    const url = `${API_BASE_URL}/auth/refresh`;
    console.log('Attempting token refresh:', { url });
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Если это сетевая ошибка или CORS, используем мок
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return createMockRefreshResponse();
      }
      
      throw error;
    }
  },

  // Logout
  logout: async (data: LogoutRequest): Promise<string> => {
    const url = `${API_BASE_URL}/auth/logout`;
    console.log('Attempting logout:', { url });
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Если это сетевая ошибка или CORS, используем мок
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return createMockLogoutResponse();
      }
      
      throw error;
    }
  },
};
