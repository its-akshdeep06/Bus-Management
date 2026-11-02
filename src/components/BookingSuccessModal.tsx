'use client';

import React from 'react';
import Image from 'next/image';
import { Booking } from '@/types';
import { CheckCircle, Share2, Ticket, X, Download, Navigation } from 'lucide-react';

interface BookingSuccessModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onShare: (booking: Booking) => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  booking,
  onClose,
  onShare,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 520, textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Animated Confirmation Illustration */}
        <div style={{ margin: '0 auto 1.2rem', width: 140, height: 140 }}>
          <Image
            src="/assets/animations/success/booking-confirmed.svg"
            alt="Ticket Confirmed"
            width={140}
            height={140}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <h2 style={{ fontSize: '1.6rem', color: 'var(--success)', marginBottom: '0.3rem' }}>
          Booking Confirmed!
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Have a wonderful and comfortable journey with Safar.
        </p>

        {/* Ticket Card Details */}
        <div
          style={{
            background: 'var(--warm-ivory)',
            border: '2px dashed var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.4rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                {booking.operator}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {booking.busType}
              </div>
            </div>
            <div
              style={{
                background: '#ffebee',
                color: 'var(--primary)',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              PNR: {booking.bookingId}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                JOURNEY ROUTE
              </span>
              <strong>{booking.route}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                SEAT NUMBER
              </span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                Seat {booking.seat}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                DEPARTURE TIME
              </span>
              <strong>{booking.departureTime}</strong> ({booking.journeyDate})
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>
                TOTAL PAID
              </span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                ₹{booking.fareBreakdown?.total}
              </strong>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-light)', paddingTop: '0.6rem' }}>
            Boarding: <strong>{booking.boardingPoint}</strong>
            <br />
            Passenger: <strong>{booking.passengerName}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => onShare(booking)}
          >
            <Share2 size={16} />
            <span>Share Ticket</span>
          </button>

          <button
            type="button"
            className="btn-outline"
            style={{ flex: 1 }}
            onClick={handlePrint}
          >
            <Download size={16} />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

