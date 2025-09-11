import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { habitService } from '@/services';
import { toast } from 'sonner';

interface ReminderData {
  habitId: number;
  description: string;
  frequencyType: string;
  timesPerFrequency: number;
  currentPeriodCompletedTimes: number;
  remainingCompletionCount: number;
  currentPeriodNumber: number;
  displayCurrentPeriodCompletedTimes: number;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<ReminderData[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();

  const fetchReminders = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      console.log('Fetching reminders...');
      const response = await habitService.getReminders(accessToken);
      console.log('Raw reminders response:', response);
      
      // Ensure we always set an array, even if response is null/undefined
      const remindersData = Array.isArray(response) ? response : [];
      
      const normalizedReminders = remindersData.map((reminder: any): ReminderData => {
        const habitId = reminder.habit_id || reminder.habitId || 0;
        const currentPeriodCompletedTimes = reminder.current_period_completed_times || reminder.currentPeriodCompletedTimes || 0;
        const remainingCompletionCount = reminder.remaining_completion_count || reminder.remainingCompletionCount || 0;
        const timesPerFrequency = reminder.times_per_frequency || reminder.timesPerFrequency || 1;
        const currentPeriodNumber = reminder.current_period_number || reminder.currentPeriodNumber || 1;
        
        // Calculate display value for current period completed times
        let displayCurrentPeriodCompletedTimes = currentPeriodCompletedTimes;
        
        const storageKey = `habit_period_${habitId}`;
        const storedPeriodNumber = localStorage.getItem(storageKey);
        const storedPeriod = storedPeriodNumber ? parseInt(storedPeriodNumber) : null;
        
        console.log(`Habit ${habitId}: current=${currentPeriodCompletedTimes}, remaining=${remainingCompletionCount}, times=${timesPerFrequency}, period=${currentPeriodNumber}, stored=${storedPeriod}`);
        
        // If period is completed (both completed times and remaining are 0), show full completion until period changes
        if (currentPeriodCompletedTimes === 0 && remainingCompletionCount === 0 && timesPerFrequency > 0) {
          if (storedPeriod === null) {
            // First time seeing this habit - assume it's completed in current period
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            displayCurrentPeriodCompletedTimes = timesPerFrequency;
            console.log(`Habit ${habitId}: First time seen, showing completion (${timesPerFrequency})`);
          } else if (storedPeriod !== currentPeriodNumber) {
            // New period detected, store it and show 0 (reset)
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            displayCurrentPeriodCompletedTimes = 0;
            console.log(`Habit ${habitId}: New period detected (${storedPeriod} -> ${currentPeriodNumber}), resetting to 0`);
          } else {
            // Same period, show completion
            displayCurrentPeriodCompletedTimes = timesPerFrequency;
            console.log(`Habit ${habitId}: Same period, showing completion (${timesPerFrequency})`);
          }
        } else {
          // Period in progress or not completed, update stored period if changed
          if (storedPeriod !== currentPeriodNumber) {
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            console.log(`Habit ${habitId}: Period in progress, updated stored period to ${currentPeriodNumber}`);
          }
        }
        
        return {
          habitId,
          description: reminder.description || '',
          frequencyType: reminder.frequency_type || reminder.frequencyType || 'daily',
          timesPerFrequency,
          currentPeriodCompletedTimes,
          remainingCompletionCount,
          currentPeriodNumber,
          displayCurrentPeriodCompletedTimes
        };
      });
      
      console.log('Normalized reminders:', normalizedReminders);
      setReminders(normalizedReminders);
    } catch (error: any) {
      if (error.status === 401) {
        console.log('Token expired, refreshing and retrying reminders fetch...');
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          try {
            const response = await habitService.getReminders(accessToken);
            const remindersData = Array.isArray(response) ? response : [];
            // Apply same normalization logic for retry
            const normalizedReminders = remindersData.map((reminder: any): ReminderData => {
              const habitId = reminder.habit_id || reminder.habitId || 0;
              const currentPeriodCompletedTimes = reminder.current_period_completed_times || reminder.currentPeriodCompletedTimes || 0;
              const remainingCompletionCount = reminder.remaining_completion_count || reminder.remainingCompletionCount || 0;
              const timesPerFrequency = reminder.times_per_frequency || reminder.timesPerFrequency || 1;
              const currentPeriodNumber = reminder.current_period_number || reminder.currentPeriodNumber || 1;
              
              let displayCurrentPeriodCompletedTimes = currentPeriodCompletedTimes;
              
              const storageKey = `habit_period_${habitId}`;
              const storedPeriodNumber = localStorage.getItem(storageKey);
              const storedPeriod = storedPeriodNumber ? parseInt(storedPeriodNumber) : null;
              
              if (currentPeriodCompletedTimes === 0 && remainingCompletionCount === 0 && timesPerFrequency > 0) {
                if (storedPeriod === null) {
                  localStorage.setItem(storageKey, currentPeriodNumber.toString());
                  displayCurrentPeriodCompletedTimes = timesPerFrequency;
                } else if (storedPeriod !== currentPeriodNumber) {
                  localStorage.setItem(storageKey, currentPeriodNumber.toString());
                  displayCurrentPeriodCompletedTimes = 0;
                } else {
                  displayCurrentPeriodCompletedTimes = timesPerFrequency;
                }
              } else {
                if (storedPeriod !== currentPeriodNumber) {
                  localStorage.setItem(storageKey, currentPeriodNumber.toString());
                }
              }
              
              return {
                habitId,
                description: reminder.description || '',
                frequencyType: reminder.frequency_type || reminder.frequencyType || 'daily',
                timesPerFrequency,
                currentPeriodCompletedTimes,
                remainingCompletionCount,
                currentPeriodNumber,
                displayCurrentPeriodCompletedTimes
              };
            });
            setReminders(normalizedReminders);
          } catch (retryError) {
            console.error('Retry reminders fetch failed:', retryError);
            toast.error('Не удалось загрузить напоминания');
          }
        }
      } else {
        console.error('Error fetching reminders:', error);
        toast.error('Ошибка загрузки напоминаний');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshAuthToken]);

  const getReminderByHabitId = useCallback((habitId: number) => {
    if (!Array.isArray(reminders)) return undefined;
    return reminders.find(reminder => reminder.habitId === habitId);
  }, [reminders]);

  useEffect(() => {
    if (accessToken) {
      fetchReminders();
    }
  }, [accessToken, fetchReminders]);

  return {
    reminders,
    loading,
    fetchReminders,
    getReminderByHabitId
  };
};