'use client';

import React from 'react';
import { Bus } from '@/types';
import { X, Star, Scale } from 'lucide-react';

interface BusComparisonModalProps {
  isOpen: boolean;
  buses: Bus[];
  onClose: () => void;
  onRemoveBus: (busId: number) => void;
  onSelectBusToBook: (bus: Bus) => void;
}

export const BusComparisonModal: React.FC<BusComparisonModalProps> = ({
  isOpen,
  buses,
  onClose,
  onRemoveBus,
  onSelectBusToBook,
}) => {
  if (!isOpen || buses.length === 0) return null;

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 880 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Scale size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem' }}>Compare Buses ({buses.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                <th style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>Feature</th>
                {buses.map((bus) => (
                  <th key={bus.id} style={{ padding: '0.8rem', minWidth: 200 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {bus.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveBus(bus.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--alert)',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {bus.type}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Fare</td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem', fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                    ₹{bus.price}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Timing</td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem' }}>
                    <span style={{ fontWeight: 700 }}>{bus.departureTime}</span> ➔ {bus.arrivalTime}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {bus.duration}</div>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Rating</td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem' }}>
                    <span
                      style={{
                        background: 'var(--success)',
                        color: 'white',
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Star size={11} fill="white" />
                      <span>{bus.rating.toFixed(1)}</span>
                    </span>{' '}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({bus.reviewsCount})</span>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Available Seats</td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                    {bus.available_seats} of {bus.total_seats} left
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Amenities</td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem', fontSize: '0.8rem' }}>
                    {bus.amenities.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '0.8rem' }}></td>
                {buses.map((bus) => (
                  <td key={bus.id} style={{ padding: '0.8rem' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
                      onClick={() => {
                        onClose();
                        onSelectBusToBook(bus);
                      }}
                    >
                      Select Bus
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

