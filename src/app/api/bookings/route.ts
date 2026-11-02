import { NextResponse } from 'next/server';
import { busStore, bookingStore, promoCodes } from '@/lib/data';
import { Booking, FareBreakdown } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const bookingId = searchParams.get('bookingId');

  if (bookingId) {
    const booking = bookingStore.find((b) => b.bookingId.toLowerCase() === bookingId.toLowerCase());
    if (!booking) {
      return NextResponse.json({ status: 'error', message: 'Booking not found.' }, { status: 404 });
    }
    if (!username || booking.username.toLowerCase() !== username.trim().toLowerCase()) {
      return NextResponse.json({ status: 'error', message: 'Booking not found.' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', booking });
  }

  if (!username) {
    return NextResponse.json({ status: 'error', message: 'Username is required.' }, { status: 400 });
  }

  const userBookings = bookingStore.filter((b) => b.username === username);
  return NextResponse.json({ status: 'success', bookings: userBookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      busId,
      seatNumber,
      username,
      passengerName,
      passengerAge,
      passengerGender,
      passengerPhone,
      boardingPoint,
      droppingPoint,
      journeyDate,
      promoCode,
    } = body;

    const bus = busStore.find((b) => b.id === Number(busId));
    if (!bus) {
      return NextResponse.json({ status: 'error', message: 'Bus not found.' }, { status: 404 });
    }

    const seatNum = Number(seatNumber);
    if (!Number.isInteger(seatNum) || seatNum < 1 || seatNum > bus.total_seats) {
      return NextResponse.json({ status: 'error', message: 'Invalid seat number selected.' }, { status: 400 });
    }

    // Check if seat is already booked
    if (bus.bookedSeats.includes(seatNum)) {
      return NextResponse.json(
        { status: 'error', message: `Seat ${seatNum} has already been reserved. Please select another seat.` },
        { status: 409 }
      );
    }

    // Calculate fare breakdown
    const baseFare = bus.price;
    const tax = Math.round(baseFare * 0.05); // 5% GST
    const convenienceFee = 30;
    let discount = 0;

    if (promoCode) {
      const promo = promoCodes.find((p) => p.code.toUpperCase() === promoCode.toUpperCase().trim());
      if (promo && baseFare >= promo.minBookingValue) {
        if (promo.discountType === 'percentage') {
          discount = Math.round((baseFare * promo.value) / 100);
        } else {
          discount = promo.value;
        }
      }
    }

    const total = Math.max(0, baseFare + tax + convenienceFee - discount);

    const fareBreakdown: FareBreakdown = {
      baseFare,
      tax,
      convenienceFee,
      discount,
      total,
    };

    // Mark seat as booked in bus state
    bus.bookedSeats.push(seatNum);
    bus.available_seats = Math.max(0, bus.total_seats - bus.bookedSeats.length);

    const newBooking: Booking = {
      bookingId: 'SFA' + Math.floor(100000 + Math.random() * 900000),
      busId: bus.id,
      operator: bus.name,
      busType: bus.type,
      route: `${bus.from} ➔ ${bus.to}`,
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      journeyDate: journeyDate || new Date().toISOString().split('T')[0],
      bookingTimestamp: new Date().toLocaleString(),
      seat: seatNum,
      passengerName: passengerName?.trim() || username || 'Passenger',
      passengerAge: Number(passengerAge) || 28,
      passengerGender: passengerGender || 'Not Specified',
      passengerPhone: passengerPhone?.trim() || '',
      boardingPoint: boardingPoint || bus.boardingPoints[0]?.name || 'Main Station',
      droppingPoint: droppingPoint || bus.droppingPoints[0]?.name || 'Terminal Gate',
      fareBreakdown,
      username: username || 'Guest',
      status: 'Confirmed',
    };

    bookingStore.unshift(newBooking);

    return NextResponse.json({
      status: 'success',
      message: 'Ticket confirmed successfully!',
      booking: newBooking,
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Unable to process booking request.' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const username = searchParams.get('username');
    if (!bookingId) {
      return NextResponse.json({ status: 'error', message: 'Booking ID required.' }, { status: 400 });
    }
    if (!username) {
      return NextResponse.json({ status: 'error', message: 'Username is required.' }, { status: 400 });
    }

    const bookingIndex = bookingStore.findIndex(
      (b) =>
        b.bookingId.toLowerCase() === bookingId.toLowerCase() &&
        b.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (bookingIndex === -1) {
      return NextResponse.json({ status: 'error', message: 'Booking not found.' }, { status: 404 });
    }

    const booking = bookingStore[bookingIndex];
    if (booking.status === 'Cancelled') {
      return NextResponse.json({ status: 'error', message: 'Booking is already cancelled.' }, { status: 409 });
    }
    booking.status = 'Cancelled';

    // Free up seat in bus
    const bus = busStore.find((b) => b.id === booking.busId);
    if (bus) {
      bus.bookedSeats = bus.bookedSeats.filter((s) => s !== Number(booking.seat));
      bus.available_seats = bus.total_seats - bus.bookedSeats.length;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Booking cancelled successfully. Seat has been released.',
      booking,
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Failed to cancel booking.' }, { status: 500 });
  }
}
