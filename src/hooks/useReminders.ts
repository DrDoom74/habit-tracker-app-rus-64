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
        
        // Enhanced logic: Show full completion when period completed, reset only on period change
        const storageKey = `habit_period_${habitId}`;
        const storedPeriodNumber = localStorage.getItem(storageKey);
        
        console.log(`[Habit ${habitId}] Period logic: completed=${currentPeriodCompletedTimes}, remaining=${remainingCompletionCount}, current_period=${currentPeriodNumber}, stored_period=${storedPeriodNumber}`);
        
        if (currentPeriodCompletedTimes === 0 && remainingCompletionCount === 0 && timesPerFrequency > 0) {
          // Period appears completed (API shows 0/0), check if it's a new period
          if (storedPeriodNumber === null) {
            // First time seeing this habit - assume it's newly completed, show full
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            displayCurrentPeriodCompletedTimes = timesPerFrequency;
            console.log(`[Habit ${habitId}] First time: showing full completion (${timesPerFrequency})`);
          } else if (parseInt(storedPeriodNumber) !== currentPeriodNumber) {
            // New period detected, show reset (0)
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            displayCurrentPeriodCompletedTimes = 0;
            console.log(`[Habit ${habitId}] New period detected: showing reset (0)`);
          } else {
            // Same period, show full completion
            displayCurrentPeriodCompletedTimes = timesPerFrequency;
            console.log(`[Habit ${habitId}] Same period: showing full completion (${timesPerFrequency})`);
          }
        } else {
          // Period in progress, update stored period if changed and use actual progress
          if (storedPeriodNumber !== currentPeriodNumber.toString()) {
            localStorage.setItem(storageKey, currentPeriodNumber.toString());
            console.log(`[Habit ${habitId}] Updated stored period to ${currentPeriodNumber}`);
          }
          console.log(`[Habit ${habitId}] In progress: showing actual progress (${currentPeriodCompletedTimes})`);
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
              
              if (currentPeriodCompletedTimes === 0 && remainingCompletionCount === 0 && timesPerFrequency > 0) {
                const storageKey = `habit_period_${habitId}`;
                const storedPeriodNumber = localStorage.getItem(storageKey);
                
                if (storedPeriodNumber === null || parseInt(storedPeriodNumber) !== currentPeriodNumber) {
                  localStorage.setItem(storageKey, currentPeriodNumber.toString());
                  displayCurrentPeriodCompletedTimes = 0;
                } else {
                  displayCurrentPeriodCompletedTimes = timesPerFrequency;
                }
              } else {
                const storageKey = `habit_period_${habitId}`;
                const storedPeriodNumber = localStorage.getItem(storageKey);
                if (storedPeriodNumber !== currentPeriodNumber.toString()) {
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