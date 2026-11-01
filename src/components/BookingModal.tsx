'use client';

import React, { useState } from 'react';
import { Bus } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  bus: Bus | null;
  seatNumber: number | null;
  currentUser: string | null;
  onClose: () => void;
  onConfirm: (passengerName: string) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  bus,
  seatNumber,
  currentUser,
  onClose,
  onConfirm,
}) => {
  const [passengerName, setPassengerName] = useState(currentUser || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !bus || !seatNumber) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(passengerName || currentUser || 'Passenger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content booking-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 style={{ marginBottom: '1rem' }}>Complete Your Booking</h2>
        <div
          style={{
            background: 'var(--bg-main)',
            padding: '1rem',
            borderRadius: 6,
            marginBottom: '1.2rem',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>
            {bus.name}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 6 }}>
            {bus.from} ➔ {bus.to} • {bus.time}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Fare per ticket:</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
              ₹{bus.price}
            </strong>
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
            Passenger Name
          </label>
          <input
            type="text"
            className="input-field"
            style={{ marginBottom: 0 }}
            placeholder="Enter passenger name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
          />
        </div>

        <div
          style={{
            marginBottom: '1.5rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <span>Selected Seat:</span>
          <span
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '2px 10px',
              borderRadius: 4,
            }}
          >
            Seat {seatNumber}
          </span>
        </div>

        <button
          className="btn-primary btn-full"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Confirming Ticket...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

