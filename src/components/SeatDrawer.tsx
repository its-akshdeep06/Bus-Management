'use client';

import React, { useState, useMemo } from 'react';
import { Bus } from '@/types';

interface SeatDrawerProps {
  bus: Bus;
  onClose: () => void;
  onContinue: (bus: Bus, seatNumber: number) => void;
}

export const SeatDrawer: React.FC<SeatDrawerProps> = ({
  bus,
  onClose,
  onContinue,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const totalSeats = 36;
  const bookedSeats = useMemo(() => {
    // Generate deterministic booked seats based on bus.id to keep layout stable across renders
    const booked = new Set<number>();
    const count = Math.max(0, totalSeats - bus.available_seats);
    for (let i = 1; i <= totalSeats && booked.size < count; i++) {
      if ((i * 7 + bus.id * 3) % 5 === 0) {
        booked.add(i);
      }
    }
    // If we still need more booked seats to match count
    let fallback = 2;
    while (booked.size < count && fallback <= totalSeats) {
      booked.add(fallback);
      fallback += 3;
    }
    return booked;
  }, [bus.id, bus.available_seats]);

  const handleSeatClick = (seatNum: number) => {
    if (bookedSeats.has(seatNum)) return;
    setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
  };

  return (
    <div className="seat-drawer">
      <div className="seat-drawer-header">
        <h4>Select your seat</h4>
        <span className="close-drawer" onClick={onClose} role="button">
          &times;
        </span>
      </div>

      <div className="seat-layout">
        <div className="bus-layout-outline">
          <div className="driver-wheel" title="Driver Cabin" />
          <div className="seat-grid">
            {Array.from({ length: totalSeats }, (_, idx) => {
              const seatNum = idx + 1;
              const isBooked = bookedSeats.has(seatNum);
              const isSelected = selectedSeat === seatNum;
              const isAisle = seatNum % 4 === 2;

              return (
                <div
                  key={seatNum}
                  className={`seat ${isBooked ? 'booked' : ''} ${
                    isSelected ? 'selected' : ''
                  } ${isAisle ? 'aisle' : ''}`}
                  onClick={() => handleSeatClick(seatNum)}
                  title={
                    isBooked
                      ? `Seat ${seatNum} (Already Booked)`
                      : `Seat ${seatNum} (Available - ₹${bus.price})`
                  }
                >
                  {seatNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="booking-action-panel">
          <h4>Booking Summary</h4>
          <div className="selected-seat-info">
            {selectedSeat ? (
              <div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Seat {selectedSeat}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  Amount: ₹{bus.price}
                </div>
              </div>
            ) : (
              <span>Select an available seat to proceed.</span>
            )}
          </div>

          <button
            className="btn-continue"
            disabled={!selectedSeat}
            onClick={() => {
              if (selectedSeat) onContinue(bus, selectedSeat);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

