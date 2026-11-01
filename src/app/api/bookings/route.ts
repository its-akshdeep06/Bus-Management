import { NextResponse } from 'next/server';
import { busStore, bookingStore } from '@/lib/data';
import { Booking } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ status: 'success', bookings: bookingStore });
  }

  const userBookings = bookingStore.filter(b => b.username === username);
  return NextResponse.json({ status: 'success', bookings: userBookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { busId, seatNumber, username, passengerName } = body;

    const bus = busStore.find(b => b.id === Number(busId));
    if (!bus) {
      return NextResponse.json(
        { status: 'error', message: 'Bus not found.' },
        { status: 404 }
      );
    }

    if (bus.available_seats <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'No seats available on this bus.' },
        { status: 400 }
      );
    }

    // Decrement available seats
    bus.available_seats -= 1;

    const newBooking: Booking = {
      bookingId: 'SFA' + Math.floor(100000 + Math.random() * 900000),
      operator: bus.name,
      route: `${bus.from} ➔ ${bus.to}`,
      from: bus.from,
      to: bus.to,
      dateAndTime: new Date().toLocaleString(),
      price: bus.price,
      seat: seatNumber,
      passengerName: passengerName || username || 'Passenger',
      username: username || 'Guest'
    };

    bookingStore.unshift(newBooking);

    return NextResponse.json({
      status: 'success',
      message: 'Booking confirmed successfully!',
      booking: newBooking
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Unable to process booking request.' },
      { status: 400 }
    );
  }
}

