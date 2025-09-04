
import { API_BASE_URL, handleResponse, USE_MOCK_MODE } from "./apiConfig";
import { CreateHabitRequest, UpdateHabitRequest, HabitListResponse, Progress } from "@/types";
import { mockHabitService } from "./mockHabitService";

// Helper function for network error detection
const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError || 
         error.message?.includes('Failed to fetch') ||
         error.message?.includes('NetworkError') ||
         error.message?.includes('CORS');
};

export const habitService = {
  // GET /tracker/habits
  listHabits: async (token: string): Promise<HabitListResponse> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.listHabits();
    }

    try {
      const url = `${API_BASE_URL}/tracker/habits`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      return handleResponse(response, { method: "GET", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.listHabits();
      }
      throw error;
    }
  },

  // GET /tracker/habits/completed
  listCompletedHabits: async (token: string): Promise<HabitListResponse> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.listCompletedHabits();
    }

    try {
      const url = `${API_BASE_URL}/tracker/habits/completed`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      return handleResponse(response, { method: "GET", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.listCompletedHabits();
      }
      throw error;
    }
  },

  // POST /tracker/habits
  createHabit: async (data: CreateHabitRequest, token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.createHabit(data);
    }

    try {
      const url = `${API_BASE_URL}/tracker/habits`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.createHabit(data);
      }
      throw error;
    }
  },

  // PUT /tracker/habits
  updateHabit: async (data: UpdateHabitRequest, token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.updateHabit(data);
    }

    try {
      const url = `${API_BASE_URL}/tracker/habits`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response, { method: "PUT", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.updateHabit(data);
      }
      throw error;
    }
  },

  // DELETE /tracker/habits/{habitId}
  deleteHabit: async (habitId: number, token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.deleteHabit(habitId);
    }

    try {
      const url = `${API_BASE_URL}/tracker/habits/${habitId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      return handleResponse(response, { method: "DELETE", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.deleteHabit(habitId);
      }
      throw error;
    }
  },

  // GET /tracker/progress/{habitId}
  getProgress: async (habitId: number, token: string): Promise<Progress> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.getProgress(habitId);
    }

    try {
      console.log(`Fetching progress for habit ${habitId}`);
      const url = `${API_BASE_URL}/tracker/progress/${habitId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      const data = await handleResponse(response, { method: "GET", url });
      console.log("Progress API response:", data);
      return data;
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.getProgress(habitId);
      }
      throw error;
    }
  },

  // POST /tracker/progress/{habitId}
  addProgress: async (habitId: number, token: string): Promise<string> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.addProgress(habitId);
    }

    try {
      const url = `${API_BASE_URL}/tracker/progress/${habitId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      return handleResponse(response, { method: "POST", url });
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.addProgress(habitId);
      }
      throw error;
    }
  },

  // GET /tracker/reminder
  getReminders: async (token: string): Promise<any> => {
    if (USE_MOCK_MODE) {
      return mockHabitService.getReminders();
    }

    try {
      const url = `${API_BASE_URL}/tracker/reminder`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      const data = await handleResponse(response, { method: "GET", url });
      
      console.log("Raw reminders API response:", data);
      
      // Normalize API response - handle both "reminder" and "reminders" keys
      let normalizedReminders = [];
      if (Array.isArray(data)) {
        normalizedReminders = data;
      } else if (data.reminder && Array.isArray(data.reminder)) {
        normalizedReminders = data.reminder;
      } else if (data.reminders && Array.isArray(data.reminders)) {
        normalizedReminders = data.reminders;
      } else if (data.data && Array.isArray(data.data)) {
        normalizedReminders = data.data;
      }
      
      // Transform nested API structure to expected format
      const transformedReminders = normalizedReminders.map(item => ({
        habit_id: item.habit?.id || 0,
        description: item.habit?.description || '',
        frequency_type: item.goal?.frequency_type || 'daily',
        times_per_frequency: item.goal?.times_per_frequency || 1,
        period_completion_count: item.current_period_completed_times || 0,
        remaining_completion_count: item.remaining_completion_count || 0,
        current_period_number: item.current_period_number || 1
      }));
      
      console.log("Normalized reminders:", transformedReminders);
      return transformedReminders;
    } catch (error) {
      if (isNetworkError(error)) {
        console.log('Network/CORS error detected, using mock response');
        return mockHabitService.getReminders();
      }
      throw error;
    }
  },
};
