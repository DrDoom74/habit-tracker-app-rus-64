import { VersionResponse } from "@/types";

// Симуляция задержки сети
const mockDelay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const mockVersionService = {
  getVersion: async (): Promise<VersionResponse> => {
    console.log('Mock API call for getVersion');
    await mockDelay();
    
    return {
      version: "1.0.0-mock"
    };
  }
};