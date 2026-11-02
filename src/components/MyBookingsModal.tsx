'use client';

import React from 'react';
import Image from 'next/image';
import { Booking } from '@/types';
import { Ticket, X, Share2, Trash2, Calendar, MapPin } from 'lucide-react';

interface MyBookingsModalProps {
  isOpen: boolean;
  bookings: Booking[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onShareBooking: (booking: Booking) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  bookings,
  onClose,
  onCancelBooking,
  onShareBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 680 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <Ticket size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem' }}>My Journeys & Tickets ({bookings.length})</h2>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ width: 140, height: 140, margin: '0 auto 1rem' }}>
              <Image
                src="/assets/illustrations/empty-states/no-bookings.svg"
                alt="No Bookings"
                width={140}
                height={140}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>No Prior Bookings Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              When you reserve a bus ticket with Safar, your confirmed digital passes will show up here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                style={{
                  background: 'var(--bg-main)',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem',
                  opacity: b.status === 'Cancelled' ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {b.operator}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                      {b.busType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: b.status === 'Cancelled' ? '#f5f5f5' : '#ffebee',
                        color: b.status === 'Cancelled' ? '#999' : 'var(--primary)',
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.82rem',
                        fontWeight: 800,
                      }}
                    >
                      PNR: {b.bookingId}
                    </span>
                    {b.status === 'Cancelled' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--alert)', fontWeight: 700 }}>
                        (Cancelled)
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', marginBottom: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.route}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Date: {b.journeyDate} • Departs: {b.departureTime} • Seat {b.seat}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{b.fareBreakdown?.total || 0}
                  </div>
                </div>

                {b.status !== 'Cancelled' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.6rem' }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                      onClick={() => onShareBooking(b)}
                    >
                      <Share2 size={13} />
                      <span>Share</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCancelBooking(b.bookingId)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-light)',
                        color: 'var(--alert)',
                        padding: '0.3rem 0.7rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Cancel Ticket</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
