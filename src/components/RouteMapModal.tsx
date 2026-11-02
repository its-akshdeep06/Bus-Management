'use client';

import React from 'react';
import Image from 'next/image';
import { Bus } from '@/types';
import { Map, X, MapPin, Navigation, Clock } from 'lucide-react';

interface RouteMapModalProps {
  isOpen: boolean;
  bus: Bus | null;
  onClose: () => void;
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  bus,
  onClose,
}) => {
  if (!isOpen || !bus) return null;

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 620 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <Map size={22} color="var(--primary)" />
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>
              Route Journey: {bus.from} ➔ {bus.to}
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {bus.name} • {bus.duration} estimated duration
            </span>
          </div>
        </div>

        {/* Visual Scene Header */}
        <div
          style={{
            background: 'var(--warm-ivory)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-light)',
          }}
        >
          <Image
            src="/assets/illustrations/roads/route-multi-stop.svg"
            alt="Multi Stop Route"
            width={480}
            height={80}
            style={{ width: '100%', height: 'auto', maxHeight: 90 }}
          />
        </div>

        {/* Boarding Points Timeline */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4
            style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontWeight: 800,
              letterSpacing: 0.5,
              marginBottom: '0.8rem',
            }}
          >
            Boarding Stops in {bus.from}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {bus.boardingPoints.map((bp, i) => (
              <div
                key={bp.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '2.5px solid var(--primary)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {bp.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Scheduled Time: <strong style={{ color: 'var(--primary)' }}>{bp.time}</strong>{' '}
                    {bp.landmark && `• Landmark: ${bp.landmark}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dropping Points Timeline */}
        <div>
          <h4
            style={{
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontWeight: 800,
              letterSpacing: 0.5,
              marginBottom: '0.8rem',
            }}
          >
            Dropping Stops in {bus.to}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {bus.droppingPoints.map((dp, i) => (
              <div
                key={dp.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '2.5px solid var(--muted-teal)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {dp.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Estimated Arrival: <strong style={{ color: 'var(--muted-teal)' }}>{dp.time}</strong>{' '}
                    {dp.landmark && `• Landmark: ${dp.landmark}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

