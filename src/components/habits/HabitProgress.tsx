
import { Progress } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitProgressProps {
  progress: Progress | null;
  loading: boolean;
  totalTrackingPeriods: number;
  timesPerFrequency: number;
  currentPeriodCompletedTimes: number;
}

const HabitProgress: React.FC<HabitProgressProps> = ({ 
  progress, 
  loading, 
  totalTrackingPeriods,
  timesPerFrequency,
  currentPeriodCompletedTimes
}) => {
  // Отладочная информация
  console.log("Progress data:", progress, "Total periods:", totalTrackingPeriods);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    );
  }

  if (!progress) {
    return <p className="text-sm text-muted-foreground">Данные о прогрессе недоступны</p>;
  }

  // Извлекаем значение total_completed_periods из объекта progress.progress
  const total_completed_periods = progress.progress ? progress.progress.total_completed_periods : 0;
  
  // Безопасно вычисляем проценты выполнения
  const completionPercentage = totalTrackingPeriods && totalTrackingPeriods > 0
    ? Math.min(Math.round((total_completed_periods / totalTrackingPeriods) * 100), 100)
    : 0;
    
  const currentPeriodPercentage = timesPerFrequency > 0
    ? Math.min(Math.round((currentPeriodCompletedTimes / timesPerFrequency) * 100), 100)
    : 0;

  return (
    <div className="space-y-2">
      {/* Общий прогресс */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">Общий прогресс</span>
          <span className="text-xs font-bold">{completionPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{total_completed_periods} из {totalTrackingPeriods} периодов</span>
      </div>

      {/* Прогресс за текущий период */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">За текущий период</span>
          <span className="text-xs font-bold">{currentPeriodPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${currentPeriodPercentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{currentPeriodCompletedTimes} из {timesPerFrequency} раз</span>
      </div>

      {/* Серия */}
      {progress.progress && progress.progress.current_streak > 0 && (
        <div className="flex justify-end">
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/10 h-5 text-xs">
            <Trophy className="h-2.5 w-2.5 text-primary" />
            <span className="font-medium">Серия: {progress.progress.current_streak}</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default HabitProgress;
