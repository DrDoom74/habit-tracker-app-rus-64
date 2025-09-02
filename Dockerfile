FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json (если есть) и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем production-версию
#RUN npm run build

# ВАЖНО: собираем со base=/app/
ARG BASE_PATH=/app/
RUN npm run build -- --base=${BASE_PATH}

# Устанавливаем глобально сервер для раздачи статики
RUN npm install -g serve

EXPOSE 8080

# Запускаем сервер для раздачи содержимого папки dist на порту 80
CMD ["serve", "-s", "dist", "-l", "8080"]
