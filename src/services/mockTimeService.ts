// Мок сервис для управления временем
let mockCurrentTime = new Date().toISOString().split('T')[0]; // Текущая дата в формате YYYY-MM-DD

// Симуляция задержки сети
const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTimeService = {
  getCurrentTime: async (): Promise<string> => {
    console.log('Mock API call for getCurrentTime');
    await mockDelay();
    
    // Возвращаем текущую мок-дату
    console.log('Mock current time:', mockCurrentTime);
    return mockCurrentTime;
  },

  nextDay: async (): Promise<string> => {
    console.log('Mock API call for nextDay');
    await mockDelay();
    
    // Увеличиваем дату на один день
    const currentDate = new Date(mockCurrentTime);
    currentDate.setDate(currentDate.getDate() + 1);
    mockCurrentTime = currentDate.toISOString().split('T')[0];
    
    console.log('Mock next day:', mockCurrentTime);
    return `Время изменено на: ${mockCurrentTime}`;
  },

  resetTime: async (): Promise<string> => {
    console.log('Mock API call for resetTime');
    await mockDelay();
    
    // Сбрасываем на текущую реальную дату
    mockCurrentTime = new Date().toISOString().split('T')[0];
    
    console.log('Mock reset time:', mockCurrentTime);
    return `Время сброшено на: ${mockCurrentTime}`;
  }
};