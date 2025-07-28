
import { API_BASE_URL, handleResponse, USE_MOCK_MODE } from "./apiConfig";
import { VersionResponse } from "@/types";
import { mockVersionService } from "./mockVersionService";

// Helper function for network error detection
const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError || 
         error.message?.includes('Failed to fetch') ||
         error.message?.includes('NetworkError') ||
         error.message?.includes('CORS');
};

export const versionService = {
  getVersion: async (): Promise<VersionResponse> => {
    if (USE_MOCK_MODE) {
      return mockVersionService.getVersion();
    }

    try {
      const url = `${API_BASE_URL}/version`;
      const response = await fetch(url, {
        method: "GET"
      });
      
      return handleResponse(response, { method: "GET", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockVersionService.getVersion();
      }
      throw error;
    }
  },
};
