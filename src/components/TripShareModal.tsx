'use client';

import React, { useState } from 'react';
import { Bus, Booking } from '@/types';
import { Share2, Copy, Check, X } from 'lucide-react';

interface TripShareModalProps {
  isOpen: boolean;
  bus?: Bus | null;
  booking?: Booking | null;
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export const TripShareModal: React.FC<TripShareModalProps> = ({
  isOpen,
  bus,
  booking,
  onClose,
  onShowNotification,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!bus && !booking)) return null;

  const title = booking
    ? `Safar Trip PNR: ${booking.bookingId} (${booking.route})`
    : bus
    ? `${bus.name} — ${bus.from} to ${bus.to}`
    : 'Safar Bus Journey';

  const shareText = booking
    ? `I have booked a bus on Safar: ${booking.operator} (${booking.route}) on ${booking.journeyDate} at ${booking.departureTime}. Seat: ${booking.seat}, PNR: ${booking.bookingId}`
    : bus
    ? `Check out ${bus.name} on Safar from ${bus.from} to ${bus.to} departing at ${bus.departureTime}. Fare: ₹${bus.price}`
    : 'Check out this bus on Safar!';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://safar.in';

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    onShowNotification('Trip details copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <Share2 size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.3rem' }}>Share Trip Details</h2>
        </div>

        <div
          style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            marginBottom: '1.2rem',
            fontSize: '0.9rem',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
            {title}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {shareText}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={handleNativeShare}
          >
            <Share2 size={16} />
            <span>Share via Apps</span>
          </button>

          <button
            type="button"
            className="btn-outline"
            style={{ flex: 1 }}
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Info'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

