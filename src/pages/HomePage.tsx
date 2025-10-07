import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateHabitRequest, Habit, SortOption } from "@/types";
import { Plus, Search, X, ArrowUpDown } from "lucide-react";
import HabitCard from "@/components/habits/HabitCard";
import CreateHabitForm from "@/components/habits/CreateHabitForm";
import RemindersSection from "@/components/habits/RemindersSection";
import AlertConfirmation from "@/components/ui/alert-confirmation";
import PageHeader from "@/components/layout/PageHeader";
import EmptyStateCard from "@/components/ui/empty-state-card";
import LoadingCards from "@/components/ui/loading-cards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MotivationalQuote } from "@/components/ui/motivational-quote";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useHabits } from "@/hooks/useHabits";
import { useTime } from "@/hooks/useTime";
import { useReminders } from "@/hooks/useReminders";

const HomePage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editHabitData, setEditHabitData] = useState<Habit | undefined>(undefined);
  const [deleteHabitId, setDeleteHabitId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const saved = localStorage.getItem("habit-sort-option");
    return (saved as SortOption) || "date-desc";
  });
  const { isAuthenticated } = useAuth();
  const { 
    habits, 
    loading: habitsLoading, 
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    addProgress 
  } = useHabits();
  const { 
    currentTime, 
    loading: timeLoading, 
    getCurrentTime 
  } = useTime();
  const { reminders, getReminderByHabitId, fetchReminders } = useReminders();

  // Load data when component mounts or user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated, loading habits and time...");
      fetchHabits();
      getCurrentTime();
      fetchReminders();
    }
  }, [isAuthenticated]);

  // Handle habit creation
  const handleCreateHabit = async (habitData: CreateHabitRequest) => {
    const success = await createHabit(habitData);
    if (success) {
      setCreateDialogOpen(false);
    }
  };

  // Handle habit update
  const handleUpdateHabit = async (habitData: CreateHabitRequest) => {
    if (!editHabitData) return;
    
    const updateData = {
      ...habitData,
      id: editHabitData.id
    };
    
    const success = await updateHabit(updateData);
    if (success) {
      setEditHabitData(undefined);
    }
  };

  // Handle habit deletion
  const handleDeleteHabit = async () => {
    if (!deleteHabitId) return;
    
    const success = await deleteHabit(deleteHabitId);
    if (success) {
      setDeleteHabitId(null);
    }
  };

  // Handle page refresh
  const handleRefresh = () => {
    fetchHabits();
    getCurrentTime();
    fetchReminders();
  };

  // Save sort option to localStorage
  useEffect(() => {
    localStorage.setItem("habit-sort-option", sortOption);
  }, [sortOption]);

  // Filter and sort habits
  const HABITS_PER_PAGE = 10;

  const filteredAndSortedHabits = useMemo(() => {
    let filtered = habits;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = habits.filter(habit =>
        habit.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return b.id - a.id;
        case 'date-asc':
          return a.id - b.id;
        case 'name-asc':
          return a.description.localeCompare(b.description);
        case 'name-desc':
          return b.description.localeCompare(a.description);
        default:
          return 0;
      }
    });

    return sorted;
  }, [habits, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedHabits.length / HABITS_PER_PAGE);

  const paginatedHabits = useMemo(() => {
    const startIndex = (currentPage - 1) * HABITS_PER_PAGE;
    const endIndex = startIndex + HABITS_PER_PAGE;
    return filteredAndSortedHabits.slice(startIndex, endIndex);
  }, [filteredAndSortedHabits, currentPage]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ActionLabel компонент для кнопки добавления привычки
  const actionLabelComponent = (
    <>
      <Plus className="h-4 w-4 mr-2" />
      Добавить привычку
    </>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Мои привычки"
        description="Управляйте своими привычками и отслеживайте прогресс"
        actionLabel={actionLabelComponent}
        onAction={() => setCreateDialogOpen(true)}
        currentTime={currentTime}
        loading={timeLoading}
        onRefresh={handleRefresh}
      />

      {/* Motivational Quote */}
      <MotivationalQuote />

      {/* Search filter and sorting */}
      {!habitsLoading && habits.length > 0 && (
        <div className="relative max-w-md">
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

      {/* Display habits list */}
      {habitsLoading ? (
        <LoadingCards count={3} />
      ) : habits.length === 0 ? (
        <EmptyStateCard 
          title="У вас пока нет привычек"
          description="Создайте свою первую привычку, чтобы начать отслеживать прогресс"
          actionLabel={actionLabelComponent}
          onAction={() => setCreateDialogOpen(true)}
        />
      ) : filteredHabits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Ничего не найдено по запросу "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>Найдено: {filteredAndSortedHabits.length} из {habits.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={(habit) => setEditHabitData(habit)}
                onDelete={(habitId) => setDeleteHabitId(habitId)}
                reminderData={getReminderByHabitId(habit.id)}
              />
            ))}
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

      {/* Always show Reminders Section */}
      <div className="mt-8">
        <RemindersSection />
      </div>

      {/* Habit creation/editing form */}
      <CreateHabitForm
        open={createDialogOpen || !!editHabitData}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditHabitData(undefined);
          }
        }}
        onSubmit={editHabitData ? handleUpdateHabit : handleCreateHabit}
        initialData={editHabitData}
        isEditing={!!editHabitData}
      />

      {/* Deletion confirmation dialog */}
      <AlertConfirmation
        open={!!deleteHabitId}
        onOpenChange={(open) => !open && setDeleteHabitId(null)}
        title="Удаление привычки"
        description="Вы уверены, что хотите удалить эту привычку? Это действие невозможно отменить."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={handleDeleteHabit}
        destructive
      />
    </div>
  );
};

export default HomePage;
