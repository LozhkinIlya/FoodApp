# FoodApp

Приложение для заказа еды: React-фронтенд и Go backend с SQLite.

## Стек

| Часть | Технологии |
|-------|------------|
| Frontend | React 18, TypeScript, Redux Toolkit, React Router, SCSS |
| Backend | Go, Gin, GORM |
| БД | SQLite |

## Быстрый старт

### Требования

- Node.js 18+
- Go 1.21+

### Запуск

1. **Backend** (в первом терминале):
   ```bash
   cd backend
   go mod tidy
   go run ./cmd/server
   ```
   Сервер: http://localhost:8080

2. **Frontend** (во втором терминале):
   ```bash
   npm install
   npm start
   ```
   Приложение: http://localhost:3000

3. **Конфигурация** — создайте `.env` в корне проекта:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```
   Или скопируйте: `cp .env.example .env`

## Структура проекта

```
FoodApp/
├── backend/           # Go API
│   ├── cmd/server/    # Точка входа
│   └── internal/      # Модели, handlers, middleware
├── public/            # Статика (изображения и т.д.)
├── src/
│   ├── components/    # React-компоненты
│   ├── contexts/      # AuthContext
│   ├── pages/         # Страницы
│   ├── reducers/      # Redux (корзина)
│   ├── services/      # API-клиент
│   └── types/         # TypeScript-типы
└── .env               # Переменные окружения (не в git)
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход (JWT) |
| GET | `/api/products` | Список продуктов |
| GET | `/api/products/:id` | Продукт по ID |
| GET | `/api/cart` | Корзина (JWT) |
| POST | `/api/cart` | Добавить в корзину (JWT) |
| DELETE | `/api/cart/:idx` | Удалить из корзины (JWT) |
| POST | `/api/orders` | Оформить заказ (JWT) |
| GET | `/api/orders` | История заказов (JWT) |

Подробнее: [backend/README.md](backend/README.md)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск dev-сервера |
| `npm run build` | Сборка для production |
| `npm test` | Запуск тестов |

## Переменные окружения

### Frontend (`.env`)

| Переменная | Описание |
|------------|----------|
| `REACT_APP_API_URL` | URL backend (по умолчанию http://localhost:8080) |

### Backend

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `PORT` | 8080 | Порт сервера |
| `DB_PATH` | foodapp.db | Путь к SQLite |
| `JWT_SECRET` | (dev) | Секрет для JWT |
