'use client';

import React from 'react';
import { Booking } from '@/types';

interface MyBookingsModalProps {
  isOpen: boolean;
  bookings: Booking[];
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  bookings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 1500 }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: 620,
          background: 'var(--bg-main)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2
          style={{
            marginBottom: '1.2rem',
            textAlign: 'left',
            paddingBottom: '0.8rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          My Trips
        </h2>

        <div
          style={{
            overflowY: 'auto',
            paddingRight: '6px',
            flex: 1,
          }}
        >
          {bookings.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'white',
                borderRadius: 8,
              }}
            >
              You have no prior bookings. Your upcoming journeys will appear here!
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.bookingId}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 8,
                  padding: '1.2rem',
                  marginBottom: '1rem',
                  background: '#fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px dashed #ddd',
                    paddingBottom: '0.8rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {b.operator}
                  </div>
                  <div
                    style={{
                      color: 'var(--primary)',
                      fontWeight: 'bold',
                      background: '#ffe4e6',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: '0.85rem',
                    }}
                  >
                    PNR: {b.bookingId}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {b.route}
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Seat{' '}
                      <strong
                        style={{
                          color: 'var(--text-main)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {b.seat}
                      </strong>{' '}
                      &nbsp;•&nbsp; Booked on {b.dateAndTime}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    ₹{b.price}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

