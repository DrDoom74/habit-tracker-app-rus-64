import { HabitListResponse, CreateHabitRequest, UpdateHabitRequest, Progress, Habit } from "@/types";

// Мок данные для привычек
const mockHabits: Habit[] = [
  {
    id: 1,
    description: "15 минут упражнений каждое утро",
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 30,
      is_completed: false
    }
  },
  {
    id: 2,
    description: "Читать минимум 30 минут в день",
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 60,
      is_completed: true
    }
  },
  {
    id: 3,
    description: "10 минут медитации перед сном",
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 21,
      is_completed: false
    }
  }
];

const mockCompletedHabits: Habit[] = [
  {
    id: 4,
    description: "Завершенный курс по React",
    goal: {
      frequency_type: "daily",
      times_per_frequency: 2,
      total_tracking_periods: 90,
      is_completed: true
    }
  }
];

const mockProgress: Record<number, Progress> = {
  1: {
    habit: {
      id: 1,
      description: "15 минут упражнений каждое утро"
    },
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 30,
      is_completed: false
    },
    progress: {
      total_completed_periods: 20,
      total_completed_times: 20,
      total_skipped_periods: 5,
      most_longest_streak: 7,
      current_streak: 5
    }
  },
  2: {
    habit: {
      id: 2,
      description: "Читать минимум 30 минут в день"
    },
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 60,
      is_completed: true
    },
    progress: {
      total_completed_periods: 60,
      total_completed_times: 60,
      total_skipped_periods: 0,
      most_longest_streak: 15,
      current_streak: 12
    }
  },
  3: {
    habit: {
      id: 3,
      description: "10 минут медитации перед сном"
    },
    goal: {
      frequency_type: "daily",
      times_per_frequency: 1,
      total_tracking_periods: 21,
      is_completed: false
    },
    progress: {
      total_completed_periods: 8,
      total_completed_times: 8,
      total_skipped_periods: 2,
      most_longest_streak: 4,
      current_streak: 3
    }
  }
};

// Симуляция задержки сети
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockHabitService = {
  listHabits: async (): Promise<HabitListResponse> => {
    console.log('Mock API call for listHabits');
    await mockDelay();
    return { username: "testuser", habits: mockHabits };
  },

  listCompletedHabits: async (): Promise<HabitListResponse> => {
    console.log('Mock API call for listCompletedHabits');
    await mockDelay();
    return { username: "testuser", habits: mockCompletedHabits };
  },

  createHabit: async (data: CreateHabitRequest): Promise<string> => {
    console.log('Mock API call for createHabit', data);
    await mockDelay();
    
    const newHabit: Habit = {
      id: Date.now(),
      description: data.description,
      goal: data.goal
    };
    
    mockHabits.push(newHabit);
    return "Привычка успешно создана";
  },

  updateHabit: async (data: UpdateHabitRequest): Promise<string> => {
    console.log('Mock API call for updateHabit', data);
    await mockDelay();
    
    const habitIndex = mockHabits.findIndex(h => h.id === data.id);
    if (habitIndex !== -1) {
      mockHabits[habitIndex] = { 
        id: data.id,
        description: data.description,
        goal: data.goal
      };
    }
    
    return "Привычка успешно обновлена";
  },

  deleteHabit: async (habitId: number): Promise<string> => {
    console.log('Mock API call for deleteHabit', habitId);
    await mockDelay();
    
    const habitIndex = mockHabits.findIndex(h => h.id === habitId);
    if (habitIndex !== -1) {
      mockHabits.splice(habitIndex, 1);
    }
    
    return "Привычка успешно удалена";
  },

  getProgress: async (habitId: number): Promise<Progress> => {
    console.log('Mock API call for getProgress', habitId);
    await mockDelay();
    
    return mockProgress[habitId] || {
      habit: {
        id: habitId,
        description: "Неизвестная привычка"
      },
      goal: {
        frequency_type: "daily",
        times_per_frequency: 1,
        total_tracking_periods: 30,
        is_completed: false
      },
      progress: {
        total_completed_periods: 0,
        total_completed_times: 0,
        total_skipped_periods: 0,
        most_longest_streak: 0,
        current_streak: 0
      }
    };
  },

  addProgress: async (habitId: number): Promise<string> => {
    console.log('Mock API call for addProgress', habitId);
    await mockDelay();
    
    const progress = mockProgress[habitId];
    
    if (progress && progress.progress) {
      progress.progress.total_completed_periods++;
      progress.progress.total_completed_times++;
      progress.progress.current_streak++;
      
      if (progress.progress.current_streak > progress.progress.most_longest_streak) {
        progress.progress.most_longest_streak = progress.progress.current_streak;
      }
    }
    
    return "Прогресс успешно добавлен";
  },

  getReminders: async (): Promise<any> => {
    console.log('Mock API call for getReminders');
    await mockDelay();
    return { reminders: [] };
  }
};