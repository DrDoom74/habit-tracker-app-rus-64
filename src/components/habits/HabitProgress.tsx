
import type { Progress as ProgressType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress as UiProgress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitProgressProps {
  progress: ProgressType | null;
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
  // Отладочная информация с детальным логированием
  console.log("HabitProgress - Progress data:", progress);
  console.log("HabitProgress - Total periods:", totalTrackingPeriods);
  console.log("HabitProgress - Times per frequency:", timesPerFrequency);
  console.log("HabitProgress - Current period completed times:", currentPeriodCompletedTimes);

  if (loading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-3/4" />
        <Skeleton className="h-2 w-1/2" />
      </div>
    );
  }

  // Всегда вычисляем значения, даже если progress null
  const totalCompleted = progress?.progress?.total_completed_periods ?? 0;
  const totalPeriods = totalTrackingPeriods || progress?.goal?.total_tracking_periods || 0;
  const currentTimes = currentPeriodCompletedTimes ?? 0;
  const times = timesPerFrequency || 0;
  const currentStreak = progress?.progress?.current_streak ?? 0;
  
  // Безопасно вычисляем проценты выполнения
  const completionPercentage = totalPeriods > 0
    ? Math.min(Math.round((totalCompleted / totalPeriods) * 100), 100)
    : 0;
    
  const currentPeriodPercentage = times > 0
    ? Math.min(Math.round((currentTimes / times) * 100), 100)
    : 0;

  console.log("HabitProgress - Calculated values:", {
    totalCompleted,
    totalPeriods,
    currentTimes,
    times,
    completionPercentage,
    currentPeriodPercentage
  });

  return (
    <div className="space-y-1.5">
      {/* Общий прогресс */}
      <div className="space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">Общий прогресс</span>
          <span className="text-xs font-bold">{completionPercentage}%</span>
        </div>
        <UiProgress value={completionPercentage} className="h-1.5" />
        <span className="text-xs text-muted-foreground">{totalCompleted} из {totalPeriods} периодов</span>
      </div>

      {/* Прогресс за текущий период */}
      <div className="space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">За текущий период</span>
          <span className="text-xs font-bold">{currentPeriodPercentage}%</span>
        </div>
        <UiProgress value={currentPeriodPercentage} className="h-1.5" />
        <div className="text-xs text-muted-foreground">
          Выполнено за текущий период: <span className="text-xs">{currentTimes}</span> из {times} раз
        </div>
      </div>

      {/* Серия - компактный бейдж справа */}
      {currentStreak > 0 && (
        <div className="flex justify-end pt-0.5">
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/10 h-4 text-xs px-1.5">
            <Trophy className="h-2 w-2 text-primary" />
            <span className="font-medium">Серия: {currentStreak}</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default HabitProgress;
