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
      console.log('Reminders fetch result:', response);
      setReminders(response || []);
    } catch (error: any) {
      if (error.status === 401) {
        console.log('Token expired, refreshing and retrying reminders fetch...');
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          try {
            const response = await habitService.getReminders(accessToken);
            setReminders(response || []);
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