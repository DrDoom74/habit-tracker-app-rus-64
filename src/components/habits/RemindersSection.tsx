import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { showApiErrorToast } from "@/components/ui/api-error-toast";

interface Reminder {
  habit_id: number;
  description: string;
  frequency_type: "daily" | "weekly" | "monthly";
  times_per_frequency: number;
  period_completion_count: number;
  remaining_completion_count: number;
  current_period_number: number;
}

const RemindersSection: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshAuthToken } = useAuth();

  const fetchReminders = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const remindersData = await habitService.getReminders(accessToken);
      console.log("Reminders data received:", remindersData);
      
      // The habitService now returns normalized data directly
      const remindersArray: Reminder[] = Array.isArray(remindersData) ? remindersData : [];
      
      console.log("Parsed reminders array:", remindersArray);
      setReminders(remindersArray);
    } catch (error) {
      console.error("Ошибка при получении напоминаний:", error);
      
      // Try to refresh token if authorization error
      if (error instanceof Error && (error as any).status === 401) {
        try {
          await refreshAuthToken();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      } else {
        showApiErrorToast(error, "Ошибка при получении напоминаний");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [accessToken]);

  const getRemainingActions = (reminder: Reminder): number => {
    if (reminder.frequency_type === "daily") {
      return Math.max(0, reminder.times_per_frequency - reminder.period_completion_count);
    }
    // For weekly and monthly, show as 1 remaining action if not completed
    return reminder.period_completion_count < reminder.times_per_frequency ? 1 : 0;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Напоминания
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Загрузка напоминаний...</p>
        </CardContent>
      </Card>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Напоминания
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Отлично! У вас нет невыполненных привычек сегодня.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Напоминания
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const remainingActions = getRemainingActions(reminder);
            
            return (
              <div
                key={reminder.habit_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{reminder.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Выполнено: {reminder.period_completion_count} из {reminder.times_per_frequency}
                    </p>
                  </div>
                </div>
                <Badge variant={remainingActions > 0 ? "destructive" : "secondary"}>
                  {remainingActions > 0 
                    ? `Осталось: ${remainingActions}`
                    : "Выполнено"
                  }
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RemindersSection;