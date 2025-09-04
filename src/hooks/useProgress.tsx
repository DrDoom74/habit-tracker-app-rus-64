
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services";
import { Progress } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showApiErrorToast } from "@/components/ui/api-error-toast";

export const useProgress = (habitId: number) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  const fetchProgress = useCallback(async () => {
    if (!habitId) {
      console.log('No habit ID provided, skipping progress fetch');
      setLoading(false);
      return;
    }

    console.log('Fetching progress for habit:', habitId);
    setLoading(true);
    
    try {
      if (!accessToken) {
        console.log('No access token available');
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const progressData = await habitService.getProgress(habitId, accessToken);
      console.log("Progress data received:", progressData);
      setProgress(progressData);
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        console.log('Attempting to refresh token due to 401 error');
        try {
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            console.log('Token refreshed successfully, retrying progress fetch');
            // Не вызываем fetchProgress рекурсивно, чтобы избежать бесконечного цикла
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      } else {
        showApiErrorToast(error, `Ошибка при получении прогресса для привычки ${habitId}`);
      }
    } finally {
      setLoading(false);
    }
  }, [habitId, accessToken, toast, refreshAuthToken]);

  const addProgress = useCallback(async () => {
    if (!habitId) {
      console.log('No habit ID provided, cannot add progress');
      return false;
    }

    // Prevent concurrent calls
    if (isAddingProgress) {
      console.log('Already adding progress, skipping...');
      return false;
    }

    console.log('Adding progress for habit:', habitId);
    setIsAddingProgress(true);
    
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return false;
      }
      
      await habitService.addProgress(habitId, accessToken);
      toast({
        title: "Прогресс добавлен",
        description: "Вы успешно отметили прогресс по привычке.",
      });
      
      // Обновляем прогресс после успешного добавления
      await fetchProgress();
      return true;
    } catch (error) {
      console.error("Ошибка при добавлении прогресса:", error);
      
      // Try to refresh token if authorization error - single attempt only
      if (error instanceof Error && (error as any).status === 401) {
        console.log('Attempting to refresh token due to 401 error');
        try {
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            console.log('Token refreshed successfully, retrying add progress once');
            await habitService.addProgress(habitId, accessToken);
            toast({
              title: "Прогресс добавлен",
              description: "Вы успешно отметили прогресс по привычке.",
            });
            await fetchProgress();
            return true;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      showApiErrorToast(error, `Ошибка при добавлении прогресса для привычки ${habitId}`);
      return false;
    } finally {
      setIsAddingProgress(false);
    }
  }, [habitId, accessToken, toast, refreshAuthToken, fetchProgress, isAddingProgress]);

  return {
    progress,
    loading,
    fetchProgress,
    addProgress,
    isAddingProgress
  };
};
