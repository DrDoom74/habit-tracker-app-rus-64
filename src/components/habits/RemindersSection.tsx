import React from 'react';
import { useReminders } from '@/hooks/useReminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar } from 'lucide-react';

const RemindersSection: React.FC = () => {
  const { reminders, loading } = useReminders();

  const getRemainingActions = (reminder: any) => {
    return Math.max(0, reminder.remainingCompletionCount);
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

  if (!Array.isArray(reminders) || reminders.length === 0) {
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
          {Array.isArray(reminders) && reminders.map((reminder) => {
            const remainingActions = getRemainingActions(reminder);
            
            return (
              <div
                key={reminder.habitId}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{reminder.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Выполнено: {reminder.currentPeriodCompletedTimes} из {reminder.timesPerFrequency}
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