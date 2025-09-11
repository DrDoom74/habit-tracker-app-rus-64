
import React, { useState, useEffect } from "react";
import { Habit } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import HabitProgress from "./HabitProgress";
import HabitActions from "./HabitActions";
import ProgressDialog from "./ProgressDialog";

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

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
  reminderData?: ReminderData;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete, reminderData }) => {
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const { progress, loading, fetchProgress, addProgress, isAddingProgress } = useProgress(habit.id);

  useEffect(() => {
    fetchProgress();
  }, [habit.id]);

  // Function to format frequency type
  const formatFrequencyType = (type: string) => {
    switch (type) {
      case "daily":
        return "ежедневно";
      case "weekly":
        return "еженедельно";
      case "monthly":
        return "ежемесячно";
      default:
        return type;
    }
  };

  const handleAddProgress = async () => {
    return await addProgress();
  };

  return (
    <>
      <Card className="habit-card card-gradient-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl truncate" title={habit.description}>
              {habit.description}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1 animate-fade-in">
              <Calendar className="h-3 w-3" />
              {formatFrequencyType(habit.goal.frequency_type)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {habit.goal.times_per_frequency} раз {formatFrequencyType(habit.goal.frequency_type)}
          </p>
        </CardHeader>
        <CardContent className="pb-2">
        <HabitProgress 
          progress={progress} 
          loading={loading}
          totalTrackingPeriods={habit.goal.total_tracking_periods}
          timesPerFrequency={habit.goal.times_per_frequency}
          currentPeriodCompletedTimes={reminderData?.displayCurrentPeriodCompletedTimes || 0}
        />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 pt-2 justify-between">
          <HabitActions 
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit.id)}
            onShowProgress={() => setShowProgressDialog(true)}
            onAddProgress={handleAddProgress}
            isAddingProgress={isAddingProgress}
          />
        </CardFooter>
      </Card>

        <ProgressDialog 
          habit={habit}
          progress={progress}
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
          onAddProgress={handleAddProgress}
          isAddingProgress={isAddingProgress}
          reminderData={reminderData}
        />
    </>
  );
};

export default HabitCard;
