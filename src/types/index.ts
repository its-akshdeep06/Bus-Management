export interface Bus {
  id: number;
  type: string;
  name: string;
  from: string;
  to: string;
  time: string;
  price: number;
  available_seats: number;
  total_seats?: number;
}

export interface Booking {
  bookingId: string;
  operator: string;
  route: string;
  from?: string;
  to?: string;
  dateAndTime: string;
  price: number;
  seat: number | string;
  passengerName?: string;
  username?: string;
}

export interface User {
  username: string;
  password?: string;
  name?: string;
  email?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

