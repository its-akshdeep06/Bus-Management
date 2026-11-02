'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Armchair, Sparkles, Check, MapPin, Tag } from 'lucide-react';
import { Bus, StopPoint, PromoCode, FareBreakdown } from '@/types';
import { promoCodes } from '@/lib/data';

interface SeatDrawerProps {
  bus: Bus;
  onClose: () => void;
  onProceedToBooking: (
    bus: Bus,
    seatNum: number,
    boardingPoint: string,
    droppingPoint: string,
    appliedPromo: PromoCode | null,
    breakdown: FareBreakdown
  ) => void;
}

export const SeatDrawer: React.FC<SeatDrawerProps> = ({
  bus,
  onClose,
  onProceedToBooking,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [seatFilter, setSeatFilter] = useState<'all' | 'window' | 'aisle'>('all');
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>(
    bus.boardingPoints[0]?.name || 'Origin Terminal'
  );
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>(
    bus.droppingPoints[0]?.name || 'Destination Terminal'
  );

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  const totalSeats = bus.total_seats || 36;
  const bookedSet = useMemo(() => new Set(bus.bookedSeats || []), [bus.bookedSeats]);

  const handleSeatClick = (seatNum: number) => {
    if (bookedSet.has(seatNum)) return;
    setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const matched = promoCodes.find((p) => p.code === code);
    if (!matched) {
      setPromoError('Invalid coupon code.');
      return;
    }
    if (bus.price < matched.minBookingValue) {
      setPromoError(`Minimum booking amount of ₹${matched.minBookingValue} required.`);
      return;
    }

    setAppliedPromo(matched);
  };

  // Fare calculation
  const fareBreakdown: FareBreakdown = useMemo(() => {
    const base = bus.price;
    const tax = Math.round(base * 0.05);
    const convenience = 30;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.discountType === 'percentage') {
        discount = Math.round((base * appliedPromo.value) / 100);
      } else {
        discount = appliedPromo.value;
      }
    }

    const total = Math.max(0, base + tax + convenience - discount);
    return {
      baseFare: base,
      tax,
      convenienceFee: convenience,
      discount,
      total,
    };
  }, [bus.price, appliedPromo]);

  return (
    <div className="seat-drawer-container">
      <div className="drawer-top-bar">
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Select Your Seat</h4>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Choose an available seat and your preferred pickup/drop points
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          &times;
        </button>
      </div>

      <div className="seat-deck-layout">
        {/* Bus Cabin Visual Layout */}
        <div>
          {/* Seat Filter Toggle */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            {(['all', 'window', 'aisle'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSeatFilter(mode)}
                style={{
                  background: seatFilter === mode ? 'var(--primary)' : 'var(--bg-surface)',
                  color: seatFilter === mode ? 'white' : 'var(--text-main)',
                  border: '1px solid var(--border-light)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {mode === 'all' ? 'All Seats' : `${mode} Seats`}
              </button>
            ))}
          </div>

          <div className="bus-chassis-outline">
            {/* Driver Steering Wheel indicator */}
            <div className="driver-cabin-indicator">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                Driver
              </span>
              <Image
                src="/assets/illustrations/doodles/steering-wheel.svg"
                alt="Driver Cabin"
                width={24}
                height={24}
                className="steering-wheel-icon"
              />
            </div>

            {/* Matrix of Seats */}
            <div className="seat-grid-matrix">
              {Array.from({ length: totalSeats }, (_, idx) => {
                const seatNum = idx + 1;
                const isBooked = bookedSet.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                const isAisleGap = seatNum % 4 === 2;

                const isWindowSeat = seatNum % 4 === 1 || seatNum % 4 === 0;
                const isAisleSeat = seatNum % 4 === 2 || seatNum % 4 === 3;

                const isDimmedByFilter =
                  (seatFilter === 'window' && !isWindowSeat) ||
                  (seatFilter === 'aisle' && !isAisleSeat);

                return (
                  <div
                    key={seatNum}
                    className={`seat-tile ${isBooked ? 'booked' : ''} ${
                      isSelected ? 'selected' : ''
                    } ${isAisleGap ? 'aisle-gap' : ''}`}
                    onClick={() => handleSeatClick(seatNum)}
                    style={{
                      opacity: isDimmedByFilter && !isBooked ? 0.35 : undefined,
                    }}
                    title={
                      isBooked
                        ? `Seat ${seatNum} (Booked)`
                        : `Seat ${seatNum} (${isWindowSeat ? 'Window' : 'Aisle'}) - ₹${bus.price}`
                    }
                  >
                    {seatNum}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="seat-legend-row">
              <div className="legend-item">
                <div className="legend-box" style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--text-muted)' }} />
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ background: 'var(--primary)' }} />
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ background: 'var(--border-light)' }} />
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout & Points Configuration */}
        <div className="booking-checkout-panel">
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
            Boarding & Dropping Points
          </h4>

          {/* Boarding Point Dropdown */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Pickup Location ({bus.from})
            </label>
            <select
              value={selectedBoardingPoint}
              onChange={(e) => setSelectedBoardingPoint(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '0.88rem',
                outline: 'none',
              }}
            >
              {bus.boardingPoints.map((bp) => (
                <option key={bp.id} value={bp.name}>
                  {bp.name} ({bp.time}) {bp.landmark ? `• ${bp.landmark}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Dropping Point Dropdown */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Drop Location ({bus.to})
            </label>
            <select
              value={selectedDroppingPoint}
              onChange={(e) => setSelectedDroppingPoint(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: '0.88rem',
                outline: 'none',
              }}
            >
              {bus.droppingPoints.map((dp) => (
                <option key={dp.id} value={dp.name}>
                  {dp.name} ({dp.time}) {dp.landmark ? `• ${dp.landmark}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Promo Code Input */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
              <Tag size={13} color="var(--primary)" />
              <span>Apply Offer Coupon</span>
            </label>
            <div className="promo-input-group">
              <input
                type="text"
                placeholder="e.g. SAFARFIRST"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={!!appliedPromo}
              />
              {appliedPromo ? (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoInput('');
                  }}
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleApplyPromo}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                  Apply
                </button>
              )}
            </div>
            {appliedPromo && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
                ✓ Coupon &quot;{appliedPromo.code}&quot; applied: -₹{fareBreakdown.discount} discount!
              </span>
            )}
            {promoError && (
              <span style={{ fontSize: '0.78rem', color: 'var(--alert)', fontWeight: 600 }}>
                {promoError}
              </span>
            )}
          </div>

          {/* Fare Summary Breakdown */}
          <table className="fare-breakdown-table">
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Base Ticket Fare:</td>
                <td>₹{fareBreakdown.baseFare}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Taxes & GST (5%):</td>
                <td>₹{fareBreakdown.tax}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Safar Convenience Fee:</td>
                <td>₹{fareBreakdown.convenienceFee}</td>
              </tr>
              {fareBreakdown.discount > 0 && (
                <tr style={{ color: 'var(--success)' }}>
                  <td>Promo Discount:</td>
                  <td>-₹{fareBreakdown.discount}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>Final Amount:</td>
                <td>₹{fareBreakdown.total}</td>
              </tr>
            </tbody>
          </table>

          {/* Action Button */}
          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={!selectedSeat}
            onClick={() => {
              if (selectedSeat) {
                onProceedToBooking(
                  bus,
                  selectedSeat,
                  selectedBoardingPoint,
                  selectedDroppingPoint,
                  appliedPromo,
                  fareBreakdown
                );
              }
            }}
          >
            {selectedSeat ? (
              <>
                <Check size={18} />
                <span>Continue with Seat {selectedSeat}</span>
              </>
            ) : (
              <span>Pick a seat to continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
