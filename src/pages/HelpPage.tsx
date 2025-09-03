import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import { Book, Target, Calendar, Clock, CheckCircle, Users, Key, BarChart } from "lucide-react";

const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Справка по системе"
        description="Руководство пользователя по трекингу привычек"
      />

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Начало работы
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Привычки
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Прогресс
          </TabsTrigger>
          <TabsTrigger value="time-control" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Управление временем
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Регистрация и авторизация
              </CardTitle>
              <CardDescription>
                Как начать работу с системой трекинга привычек
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Создание аккаунта
                </h4>
                <p className="text-muted-foreground mb-3">
                  Для работы с системой необходимо создать учетную запись. 
                  При регистрации укажите следующие данные:
                </p>
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">Email</span>
                      <p className="text-sm text-muted-foreground">
                        Уникальный почтовый адрес в формате name@domain.com
                      </p>
                    </div>
                    <Badge variant="destructive">Обязательно</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">Логин (Username)</span>
                      <p className="text-sm text-muted-foreground">
                        3-30 символов: латиница, цифры, подчеркивание
                      </p>
                    </div>
                    <Badge variant="destructive">Обязательно</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">Пароль</span>
                      <p className="text-sm text-muted-foreground">
                        5-40 символов, минимум 1 буква и 1 цифра
                      </p>
                    </div>
                    <Badge variant="destructive">Обязательно</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Вход в систему</h4>
                <p className="text-muted-foreground">
                  Для доступа к своим привычкам используйте логин и пароль. 
                  Система выдает токены доступа сроком на 15 минут, которые автоматически обновляются.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Управление привычками
              </CardTitle>
              <CardDescription>
                Создание, редактирование и удаление привычек
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Создание новой привычки</h4>
                <p className="text-muted-foreground mb-4">
                  Каждая привычка определяется следующими параметрами:
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Описание привычки</h5>
                    <p className="text-sm text-muted-foreground">
                      Название от 1 до 80 символов. Например: "Выпить стакан воды", "Сделать зарядку"
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Частота выполнения</h5>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">daily</Badge>
                      <Badge variant="outline">weekly</Badge>
                      <Badge variant="outline">monthly</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Как часто нужно выполнять привычку
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Количество раз</h5>
                    <p className="text-sm text-muted-foreground">
                      Сколько раз за период нужно выполнить (1-100). 
                      Например: 2 раза в день, 3 раза в неделю
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Общее количество периодов</h5>
                    <p className="text-sm text-muted-foreground">
                      Сколько периодов отслеживать привычку (1-1000). 
                      Например: 30 дней, 12 недель
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Редактирование и удаление</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Важно:</strong> Привычки можно изменять и удалять только в текущий день. 
                    В будущих датах эти действия недоступны.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Отслеживание прогресса
              </CardTitle>
              <CardDescription>
                Как работает система прогресса и достижений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Отметка выполнения</h4>
                <p className="text-muted-foreground mb-4">
                  Для формирования привычки отмечайте каждое выполнение. 
                  Система автоматически подсчитывает ваш прогресс.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Показатели прогресса</h4>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">total_completed_periods</h5>
                      <p className="text-sm text-muted-foreground">
                        Количество периодов, в которых вы достигли цели. 
                        При достижении всех периодов привычка считается сформированной.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">period_completion_count</h5>
                      <p className="text-sm text-muted-foreground">
                        Сколько раз выполнили действие в текущем периоде. 
                        Сбрасывается при переходе к новому периоду.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">current_streak</h5>
                      <p className="text-sm text-muted-foreground">
                        Количество периодов подряд, в которых вы достигли цели. 
                        Прерывается при пропуске периода.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <BarChart className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">best_streak</h5>
                      <p className="text-sm text-muted-foreground">
                        Максимальное количество периодов подряд за все время.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Напоминания</h4>
                <p className="text-muted-foreground">
                  Привычки автоматически появляются в списке напоминаний, если вы не достигли 
                  целевого количества выполнений в текущем периоде.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Управление временем
              </CardTitle>
              <CardDescription>
                Как работает система времени и дат в приложении
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Текущая дата</h4>
                <p className="text-muted-foreground mb-4">
                  По умолчанию система работает с текущим днем. В этом режиме доступны все функции:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Создание новых привычек</li>
                  <li>Редактирование существующих привычек</li>
                  <li>Удаление привычек</li>
                  <li>Отметка прогресса</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Путешествие в будущее</h4>
                <p className="text-muted-foreground mb-4">
                  Вы можете перемещаться в будущие даты для планирования и просмотра прогресса:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-medium text-blue-800">Переход на следующий день</span>
                      <p className="text-sm text-blue-600">
                        Используйте функцию "Следующий день" для перемещения вперед по времени
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-medium text-green-800">Возврат к текущему дню</span>
                      <p className="text-sm text-green-600">
                        Используйте "Сброс времени" для возврата к реальной дате
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Ограничения в будущем</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm mb-2">
                    <strong>В будущих датах нельзя:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 ml-4">
                    <li>Редактировать привычки</li>
                    <li>Удалять привычки</li>
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Но можно:</strong> просматривать прогресс и отмечать выполнение привычек
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Практические советы</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Используйте переход в будущее для планирования и мотивации
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Всегда возвращайтесь к текущему дню для редактирования привычек
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Система учитывает только прошлые действия, не будущие
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;