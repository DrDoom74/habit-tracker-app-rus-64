import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { habitService } from "@/services/api";
import { Habit } from "@/types";
import { RefreshCw, Trophy, CalendarCheck, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

const CompletedHabitsPage: React.FC = () => {
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { accessToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();

  // Загрузка завершенных привычек
  const fetchCompletedHabits = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({
          title: "Ошибка авторизации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }
      
      const result = await habitService.listCompletedHabits(accessToken);
      setCompletedHabits(result.habits || []);
    } catch (error) {
      console.error("Ошибка при получении завершенных привычек:", error);
      
      // Пробуем обновить токен, если причина в авторизации
      if (error instanceof Error && (error as any).status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          fetchCompletedHabits();
        }
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить завершенные привычки.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCompletedHabits();
    }
  }, [accessToken]);

  // Filter and paginate completed habits
  const HABITS_PER_PAGE = 10;

  const filteredHabits = useMemo(() => {
    if (!searchQuery.trim()) return completedHabits;
    return completedHabits.filter(habit =>
      habit.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [completedHabits, searchQuery]);

  const totalPages = Math.ceil(filteredHabits.length / HABITS_PER_PAGE);

  const paginatedHabits = useMemo(() => {
    const startIndex = (currentPage - 1) * HABITS_PER_PAGE;
    const endIndex = startIndex + HABITS_PER_PAGE;
    return filteredHabits.slice(startIndex, endIndex);
  }, [filteredHabits, currentPage]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Функция для форматирования типа частоты
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

  // Функция для рендеринга карточки завершенной привычки
  const renderCompletedHabitCard = (habit: Habit) => (
    <Card key={habit.id} className="overflow-hidden card-gradient-secondary habit-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl" title={habit.description}>
            {habit.description}
          </CardTitle>
          <Badge className="bg-habit-completed text-white">Завершена</Badge>
        </div>
        <CardDescription>
          {habit.goal.times_per_frequency} раз {formatFrequencyType(habit.goal.frequency_type)}
          {habit.completed_at && (() => {
            try {
              let date;
              
              // Try parsing as ISO string first
              if (typeof habit.completed_at === 'string') {
                date = parseISO(habit.completed_at);
              }
              
              // If that fails, try parsing as epoch number
              if (!date || !isValid(date)) {
                const timestamp = typeof habit.completed_at === 'number' 
                  ? habit.completed_at 
                  : parseInt(habit.completed_at);
                
                if (!isNaN(timestamp)) {
                  // Handle both seconds and milliseconds epochs
                  date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
                }
              }
              
              if (date && isValid(date)) {
                return (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Завершена: {format(date, 'dd.MM.yyyy HH:mm')}
                  </div>
                );
              }
            } catch (e) {
              console.error('Error parsing completion date:', e, habit.completed_at);
            }
            return null;
          })()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-habit-completed/10 p-4 rounded-md flex items-center gap-3 border border-habit-completed/20">
          <Trophy className="h-5 w-5 text-habit-completed" />
          <div>
            <p className="font-medium">Привычка сформирована!</p>
            <p className="text-sm text-muted-foreground">
              Вы успешно выполнили задачу на протяжении {habit.goal.total_tracking_periods} периодов
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="outline" size="sm" disabled className="glass-card border-habit-completed/20 w-full sm:w-auto">
          <CalendarCheck className="h-4 w-4 mr-2 text-habit-completed" />
          Завершена
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-gradient-primary p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-habit-completed to-habit-completed/70 bg-clip-text text-transparent">
              Завершенные привычки
            </h1>
            <p className="text-muted-foreground mt-1">
              Список привычек, которые вы успешно сформировали
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCompletedHabits}
            disabled={loading}
            className="glass-card border-habit-completed/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      {/* Search filter */}
      {!loading && completedHabits.length > 0 && (
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Отображение списка завершенных привычек */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2].map((i) => (
            <Card key={i} className="border p-6 space-y-4 card-gradient-secondary">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-16 bg-muted rounded animate-pulse w-full mt-4"></div>
              <div className="flex justify-end pt-4">
                <div className="h-9 bg-muted rounded animate-pulse w-28"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : completedHabits.length === 0 ? (
        <Card className="card-gradient-secondary p-8 mt-8 text-center rounded-lg">
          <h3 className="text-lg font-medium">У вас пока нет завершенных привычек</h3>
          <p className="text-muted-foreground mt-2">
            Продолжайте работать над своими текущими привычками, и они появятся здесь после завершения
          </p>
        </Card>
      ) : filteredHabits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Ничего не найдено по запросу "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>Найдено: {filteredHabits.length} из {completedHabits.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedHabits.map(renderCompletedHabitCard)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompletedHabitsPage;
