# Запуск через Docker Compose

1. Построить и запустить все сервисы:

```bash
docker-compose up --build
```

2. Доступ к сервисам:

- Web (Next.js): http://localhost:3000
- Backend API: http://localhost:4000
- Postgres: порт 5432
- MinIO: http://localhost:9000 (логин: minioadmin / minioadmin)

Примечание: файлы `.env` в `packages/backend` и `packages/techno-dom` используются локально; для Docker Compose переменные заданы в `docker-compose.yml`.
