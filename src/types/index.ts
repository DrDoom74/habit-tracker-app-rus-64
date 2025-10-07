// Типы для аутентификации
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  access_token: string;
}

// Типы для привычек
export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export type SortOption = 
  | 'date-desc' 
  | 'date-asc' 
  | 'name-asc' 
  | 'name-desc' 
  | 'progress-desc' 
  | 'streak-desc';

export interface Goal {
  id?: number;
  frequency_type: FrequencyType;
  times_per_frequency: number;
  total_tracking_periods: number;
  is_completed?: boolean;
}

export interface CreateHabitRequest {
  description: string;
  goal: Omit<Goal, 'id'>;
}

export interface Habit {
  id: number;
  description: string;
  goal: Goal;
  completed_at?: string;
}

export interface HabitListResponse {
  username: string;
  habits: Habit[];
}

export interface UpdateHabitRequest {
  id: number;
  description: string;
  goal: Omit<Goal, 'id'>;
}

// Типы для прогресса
export interface ProgressData {
  total_completed_periods: number;
  total_completed_times: number;
  total_skipped_periods: number;
  most_longest_streak: number;
  current_streak: number;
}

export interface Progress {
  goal?: Goal;
  progress?: ProgressData;
  habit?: {
    id: number;
    description: string;
  };
}

// Тип для версии API
export interface VersionResponse {
  version: string;
}

// Типы для обработки ошибок
export interface ApiErrorDetails {
  method?: string;
  url?: string;
  status?: number;
  statusText?: string;
  errorCode?: string;
  message: string;
  timestamp?: string;
  originalError?: unknown;
  responseBody?: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
  path?: string;
  timestamp?: string;
  details?: Record<string, any>;
}

// Типы для контекста аутентификации
export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
}
