# Бэкенд сервиса выдачи билетов

 Этот сервер предоставляет базовые эндпоинты для работы с событиями и бронированиями, имитируя простой сервис бронирования билетов. Вы можете расширить его функциональность по мере необходимости

## Примеры запросов

    Получить список событий:
    ```bash
    curl http://localhost:3000/events
    ```

    Получить конкретное событие:
    ```bash
    curl http://localhost:3000/events/1
    ```

    Создать бронирование:
    ```bash
    curl -X POST http://localhost:3000/bookings \
      -H "Content-Type: application/json" \
      -d '{"eventId": "1", "userId": "user3", "tickets": 3}'
    ```

    Отменить бронирование:
    ```bash
        curl -X DELETE http://localhost:3000/bookings/101
    ```
