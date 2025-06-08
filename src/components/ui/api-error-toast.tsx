
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ApiErrorHandler } from '@/utils/errorHandler';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface ApiErrorToastProps {
  error: unknown;
  context?: string;
}

const getErrorMessage = (error: unknown): { title: string; message: string; details?: any } => {
  console.log('Processing error for toast:', error);
  
  // Если это объект ошибки с информацией о статусе
  if (error && typeof error === 'object' && 'status' in error) {
    const errorObj = error as any;
    
    switch (errorObj.status) {
      case 403:
        return {
          title: "Доступ запрещён",
          message: "У вас нет прав для выполнения этого действия. Возможно, сервер заблокировал запрос из-за политик CORS.",
          details: errorObj
        };
      case 401:
        return {
          title: "Ошибка авторизации",
          message: "Необходимо войти в систему или обновить токен доступа.",
          details: errorObj
        };
      case 404:
        return {
          title: "Ресурс не найден",
          message: "Запрашиваемый ресурс не существует.",
          details: errorObj
        };
      case 500:
        return {
          title: "Ошибка сервера",
          message: "Внутренняя ошибка сервера. Попробуйте позже.",
          details: errorObj
        };
      default:
        return {
          title: `Ошибка ${errorObj.status}`,
          message: errorObj.message || errorObj.statusText || "Произошла ошибка при выполнении запроса.",
          details: errorObj
        };
    }
  }
  
  // Если это стандартная ошибка JavaScript
  if (error instanceof Error) {
    return {
      title: "Ошибка сети",
      message: error.message || "Не удалось выполнить запрос к серверу.",
      details: error
    };
  }
  
  // Если это строка
  if (typeof error === 'string') {
    return {
      title: "Ошибка",
      message: error,
      details: null
    };
  }
  
  // Fallback для неизвестных типов ошибок
  return {
    title: "Неизвестная ошибка",
    message: "Произошла неожиданная ошибка.",
    details: error
  };
};

export const showApiErrorToast = async (error: unknown, context?: string) => {
  const { title, message, details } = getErrorMessage(error);
  const contextPrefix = context ? `${context}: ` : '';
  const fullTitle = `${contextPrefix}${title}`;
  
  console.log('Showing error toast:', { title: fullTitle, message, details });
  
  toast({
    variant: "destructive",
    title: fullTitle,
    description: (
      <div className="mt-1 text-sm space-y-2 select-text">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="font-medium select-text">{message}</p>
        </div>
        
        {details && (
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground select-text">
                {details.method && details.url && 
                  `${details.method} ${details.url.split('/').slice(-2).join('/')}`}
              </p>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <span className="text-xs">Подробнее</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="mt-2 space-y-2 rounded border border-destructive/20 p-2 bg-destructive/5 text-xs select-text">
                {details.method && details.url && (
                  <div className="flex flex-col">
                    <span className="font-semibold">Запрос:</span>
                    <code className="text-xs select-text">{details.method} {details.url}</code>
                  </div>
                )}
                
                {details.status && (
                  <div className="flex flex-col">
                    <span className="font-semibold">Статус:</span>
                    <code className="select-text">{details.status} {details.statusText || 'Unknown'}</code>
                  </div>
                )}
                
                {details.responseBody && (
                  <div className="flex flex-col">
                    <span className="font-semibold">Ответ API:</span>
                    <code className="whitespace-pre-wrap break-all select-text">{details.responseBody}</code>
                  </div>
                )}
                
                {details.timestamp && (
                  <div className="flex flex-col">
                    <span className="font-semibold">Время:</span>
                    <code className="select-text">{new Date(details.timestamp).toLocaleString()}</code>
                  </div>
                )}
                
                {details && typeof details === 'object' && (
                  <details className="text-xs mt-2">
                    <summary className="cursor-pointer font-semibold">Технические детали</summary>
                    <pre className="mt-1 p-2 bg-destructive/10 rounded overflow-auto max-h-32 text-[10px] select-text">
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    ),
  });
};

const ApiErrorToast: React.FC<ApiErrorToastProps> = ({ error, context }) => {
  React.useEffect(() => {
    showApiErrorToast(error, context);
  }, [error, context]);
  
  return null;
};

export default ApiErrorToast;
