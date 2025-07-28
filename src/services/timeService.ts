
import { API_BASE_URL, handleResponse, USE_MOCK_MODE } from "./apiConfig";
import { mockTimeService } from "./mockTimeService";

// Helper function for network error detection
const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError || 
         error.message?.includes('Failed to fetch') ||
         error.message?.includes('NetworkError') ||
         error.message?.includes('CORS');
};

export const timeService = {
  // Get current time
  getCurrentTime: async (token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockTimeService.getCurrentTime();
    }

    try {
      const url = `${API_BASE_URL}/time/current-time`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      });

      const result = await handleResponse(response, { method: "GET", url });
      // Если результат – объект с ключом currentTime, возвращаем его, иначе возвращаем результат как есть
      if (result && typeof result === "object" && "currentTime" in result) {
        return result.currentTime;
      }
      return result;
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockTimeService.getCurrentTime();
      }
      throw error;
    }
  },

  // Next day
  nextDay: async (token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockTimeService.nextDay();
    }

    try {
      const url = `${API_BASE_URL}/time/next-day`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": token
        }
      });

      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockTimeService.nextDay();
      }
      throw error;
    }
  },

  // Reset time
  resetTime: async (token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockTimeService.resetTime();
    }

    try {
      const url = `${API_BASE_URL}/time/reset-time`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": token
        }
      });

      return handleResponse(response, { method: "PUT", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockTimeService.resetTime();
      }
      throw error;
    }
  },
};
