'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Bus, PromoCode, FareBreakdown } from '@/types';
import { X, ShieldCheck, MapPin, User, Phone, CheckCircle, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  bus: Bus | null;
  seatNumber: number | null;
  boardingPoint: string;
  droppingPoint: string;
  journeyDate: string;
  appliedPromo: PromoCode | null;
  fareBreakdown: FareBreakdown | null;
  currentUser: string | null;
  onClose: () => void;
  onConfirm: (passengerData: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  }) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  bus,
  seatNumber,
  boardingPoint,
  droppingPoint,
  journeyDate,
  appliedPromo,
  fareBreakdown,
  currentUser,
  onClose,
  onConfirm,
}) => {
  const [passengerName, setPassengerName] = useState(currentUser || '');
  const [age, setAge] = useState('26');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !bus || !seatNumber || !fareBreakdown) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setValidationError('Please enter passenger full name.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please enter a valid contact phone number.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    try {
      await onConfirm({
        name: passengerName.trim(),
        age: Number(age) || 25,
        gender,
        phone: phone.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close" disabled={isSubmitting}>
          <X size={18} />
        </button>

        {isSubmitting ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ width: 84, height: 84, margin: '0 auto 1.4rem' }}>
              <Image
                src="/assets/animations/loading/wheel-spinner.svg"
                alt="Processing Reservation"
                width={84}
                height={84}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div style={{ width: 140, height: 28, margin: '0 auto 1.2rem' }}>
              <Image
                src="/assets/animations/loading/route-dots.svg"
                alt="Verifying Seat"
                width={140}
                height={28}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Securing Seat #{seatNumber}...
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 380, margin: '0 auto' }}>
              Communicating with {bus.name} operator network and allocating your confirmed digital pass. Please wait 3 seconds while your ticket is registered.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
              Complete Passenger Details
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
              Your digital ticket and live tracking link will be sent to these details.
            </p>

        {/* Journey Summary Box */}
        <div
          style={{
            background: 'var(--warm-ivory)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.4rem',
            border: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {bus.name}
            </span>
            <span
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 800,
              }}
            >
              Seat {seatNumber}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <strong>{bus.from}</strong> ➔ <strong>{bus.to}</strong> • Travel Date: {journeyDate}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Boarding: <strong style={{ color: 'var(--text-main)' }}>{boardingPoint}</strong>
            <br />
            Dropping: <strong style={{ color: 'var(--text-main)' }}>{droppingPoint}</strong>
          </div>
        </div>

        {validationError && (
          <div
            style={{
              background: '#ffebee',
              color: 'var(--alert)',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Passenger Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Passenger Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priyanshu Sharma"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Age & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Age *
              </label>
              <input
                type="number"
                min="5"
                max="100"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Phone */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              WhatsApp / Mobile Number for SMS Updates *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Total Fare Preview */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.8rem 1rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.4rem',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Payable Amount:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{fareBreakdown.total}
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {isSubmitting ? (
              <span>Confirming Reservation...</span>
            ) : (
              <>
                <CreditCard size={18} />
                <span>Confirm & Reserve Seat {seatNumber}</span>
              </>
            )}
          </button>
        </form>
          </>
        )}
      </div>
    </div>
  );
};
