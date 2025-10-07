
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Страницы
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import CompletedHabitsPage from "@/pages/CompletedHabitsPage";
import TimeControlPage from "@/pages/TimeControlPage";
import HelpPage from "@/pages/HelpPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Компоненты макета
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Calculate dynamic basename for different environments
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  console.log("App basename:", basename, "BASE_URL:", import.meta.env.BASE_URL);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={basename || undefined}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Защищенные маршруты с применением макета */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/completed" element={<CompletedHabitsPage />} />
              <Route path="/time-control" element={<TimeControlPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
