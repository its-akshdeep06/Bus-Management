import { Bus, User, Booking } from '@/types';

export const initialBuses: Bus[] = [
  { id: 1, type: "AC Sleeper", name: "Delhi Express", from: "Delhi", to: "Jaipur", time: "10:00 AM", price: 800, available_seats: 39, total_seats: 40 },
  { id: 2, type: "AC Semi-Sleeper", name: "Rajdhani Bus", from: "Mumbai", to: "Pune", time: "11:30 AM", price: 650, available_seats: 12, total_seats: 40 },
  { id: 3, type: "Volvo AC", name: "Southern Travels", from: "Bangalore", to: "Chennai", time: "08:00 PM", price: 1200, available_seats: 10, total_seats: 40 },
  { id: 4, type: "Non-AC Seater", name: "Himalayan Route", from: "Chandigarh", to: "Shimla", time: "06:00 AM", price: 400, available_seats: 25, total_seats: 40 },
  { id: 5, type: "AC Sleeper", name: "Tech Corridor", from: "Hyderabad", to: "Vijayawada", time: "09:00 PM", price: 900, available_seats: 8, total_seats: 40 },
  { id: 6, type: "AC Seater", name: "DTC AC Spl", from: "Delhi", to: "Noida", time: "08:30 AM", price: 150, available_seats: 45, total_seats: 50 },
  { id: 7, type: "AC Seater", name: "BEST AC King", from: "Mumbai", to: "Navi Mumbai", time: "09:15 AM", price: 120, available_seats: 22, total_seats: 40 },
  { id: 8, type: "Volvo AC", name: "BMTC Volvo", from: "Bangalore", to: "Mysore", time: "07:45 AM", price: 350, available_seats: 35, total_seats: 40 },
  { id: 9, type: "Non-AC Seater", name: "MTC Deluxe", from: "Chennai", to: "Pondicherry", time: "04:30 PM", price: 250, available_seats: 15, total_seats: 40 },
  { id: 10, type: "AC Sleeper", name: "Jaipur Express", from: "Jaipur", to: "Delhi", time: "02:00 PM", price: 800, available_seats: 38, total_seats: 40 },
  { id: 11, type: "AC Semi-Sleeper", name: "Pune Fastlink", from: "Pune", to: "Mumbai", time: "03:30 PM", price: 650, available_seats: 15, total_seats: 40 },
  { id: 12, type: "Volvo AC", name: "Kaveri Travels", from: "Chennai", to: "Bangalore", time: "09:00 PM", price: 1200, available_seats: 18, total_seats: 40 },
  { id: 13, type: "Non-AC Seater", name: "Shimla Flyer", from: "Shimla", to: "Chandigarh", time: "12:00 PM", price: 400, available_seats: 10, total_seats: 40 },
  { id: 14, type: "AC Sleeper", name: "Andhra Express", from: "Vijayawada", to: "Hyderabad", time: "06:00 AM", price: 900, available_seats: 30, total_seats: 40 },
  { id: 15, type: "Volvo AC", name: "Shatabdi Bus", from: "Delhi", to: "Mumbai", time: "05:00 PM", price: 2500, available_seats: 45, total_seats: 50 },
  { id: 16, type: "Volvo AC", name: "Shatabdi Bus", from: "Mumbai", to: "Delhi", time: "06:00 PM", price: 2500, available_seats: 42, total_seats: 50 },
  { id: 17, type: "AC Semi-Sleeper", name: "KSTDC Connect", from: "Bangalore", to: "Goa", time: "07:00 AM", price: 1500, available_seats: 50, total_seats: 50 },
  { id: 18, type: "AC Semi-Sleeper", name: "KSTDC Connect", from: "Goa", to: "Bangalore", time: "05:00 PM", price: 1500, available_seats: 48, total_seats: 50 },
  { id: 19, type: "AC Sleeper", name: "RedBus Special", from: "Delhi", to: "Manali", time: "05:30 PM", price: 1800, available_seats: 20, total_seats: 40 }
];

export const initialUsers: Record<string, string> = {};

// In-memory data store for server-side API routes
export const busStore = [...initialBuses];
export const userStore: Record<string, string> = { ...initialUsers };
export const bookingStore: Booking[] = [];

