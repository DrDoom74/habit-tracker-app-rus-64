
import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/layout/AppHeader";
import { Loader2 } from "lucide-react";

const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // В демо-режиме пользователь всегда авторизован, но оставляем код для полноты
  // функциональности

  // Если загрузка, показываем индикатор
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу авторизации
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Если пользователь аутентифицирован, отображаем макет приложения
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4 space-y-2">
          <div>TrackHabits &copy; 2025 - Демо-режим</div>
          <div>
            <a 
              href="https://aklimenkoschool.ru/creator/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Школа Алексея Клименко
            </a>
            {" "}по тестированию ПО
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
