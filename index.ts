import { Hono } from 'hono';

// Типы для данных
type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  availableTickets: number;
};

type Booking = {
  id: string;
  eventId: string;
  userId: string;
  tickets: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
};

// Моковые данные
const events: Event[] = [
  {
    id: '1',
    name: 'Концерт рок-группы',
    date: '2023-12-15T19:00:00',
    location: 'Главный концертный зал',
    availableTickets: 100,
  },
  {
    id: '2',
    name: 'Театральная премьера',
    date: '2023-12-20T18:30:00',
    location: 'Городской театр',
    availableTickets: 50,
  },
  {
    id: '3',
    name: 'Кинофестиваль',
    date: '2024-01-10T10:00:00',
    location: 'Кинотеатр "Премьер"',
    availableTickets: 200,
  },
];

const bookings: Booking[] = [
  {
    id: '101',
    eventId: '1',
    userId: 'user1',
    tickets: 2,
    status: 'confirmed',
    createdAt: '2023-11-01T10:00:00',
  },
  {
    id: '102',
    eventId: '2',
    userId: 'user2',
    tickets: 4,
    status: 'confirmed',
    createdAt: '2023-11-02T11:30:00',
  },
];

// Создаем приложение Hono
const app = new Hono();

// Middleware для логирования
app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.path}`);
  await next();
});

// Роуты для событий
app.get('/events', (c) => {
  return c.json(events);
});

app.get('/events/:id', (c) => {
  const id = c.req.param('id');
  const event = events.find((e) => e.id === id);
  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }
  return c.json(event);
});

// Роуты для бронирований
app.get('/bookings', (c) => {
  return c.json(bookings);
});

app.post('/bookings', async (c) => {
  const body = await c.req.json();
  const { eventId, userId, tickets } = body;

  // Валидация
  if (!eventId || !userId || !tickets) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }

  if (event.availableTickets < tickets) {
    return c.json({ error: 'Not enough tickets available' }, 400);
  }

  // Создаем бронирование
  const newBooking: Booking = {
    id: `b${Math.floor(Math.random() * 10000)}`,
    eventId,
    userId,
    tickets,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  event.availableTickets -= tickets;

  return c.json(newBooking, 201);
});

app.delete('/bookings/:id', (c) => {
  const id = c.req.param('id');
  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return c.json({ error: 'Booking not found' }, 404);
  }

  const booking = bookings[bookingIndex];
  if (!booking) {
    return c.json({ error: 'Booking not found' }, 404);
  } // booking может быть undefined, а это ошибка в ts, поэтому используем ранний выхода

  booking.status = 'cancelled';

  // Возвращаем билеты
  const event = events.find((e) => e.id === booking.eventId);
  if (event) {
    event.availableTickets += booking.tickets;
  }

  return c.json(booking);
});

// Запуск сервера
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);
export default {
  port,
  fetch: app.fetch,
};
