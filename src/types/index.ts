export type BusType = 'AC Sleeper' | 'AC Semi-Sleeper' | 'Volvo AC' | 'Non-AC Seater' | 'AC Seater';

export type Amenity = 'WiFi' | 'Charging Point' | 'Blanket' | 'Water Bottle' | 'Live Tracking' | 'Reading Light' | 'Emergency Exit';

export interface StopPoint {
  id: string;
  name: string;
  time: string;
  landmark?: string;
}

export interface Bus {
  id: number;
  type: BusType;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  available_seats: number;
  total_seats: number;
  bookedSeats: number[];
  rating: number;
  reviewsCount: number;
  amenities: Amenity[];
  boardingPoints: StopPoint[];
  droppingPoints: StopPoint[];
  operatorContact?: string;
}

export interface FareBreakdown {
  baseFare: number;
  tax: number;
  convenienceFee: number;
  discount: number;
  total: number;
}

export interface Booking {
  bookingId: string;
  busId: number;
  operator: string;
  busType: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  journeyDate: string;
  bookingTimestamp: string;
  seat: number | string;
  passengerName: string;
  passengerAge?: number;
  passengerGender?: string;
  passengerPhone?: string;
  boardingPoint: string;
  droppingPoint: string;
  fareBreakdown: FareBreakdown;
  username: string;
  status: 'Confirmed' | 'Cancelled';
}

export interface NotificationItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface PromoCode {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minBookingValue: number;
}
