'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Wifi, BatteryCharging, Shield, Clock, Map, Share2, Scale, Heart } from 'lucide-react';
import { Bus, PromoCode, FareBreakdown } from '@/types';
import { SeatDrawer } from './SeatDrawer';

interface BusCardProps {
  bus: Bus;
  isOpen: boolean;
  onToggleDrawer: (busId: number) => void;
  onProceedToBooking: (
    bus: Bus,
    seatNum: number,
    boardingPoint: string,
    droppingPoint: string,
    appliedPromo: PromoCode | null,
    breakdown: FareBreakdown
  ) => void;
  onOpenRouteMap: (bus: Bus) => void;
  onShareTrip: (bus: Bus) => void;
  isCompared: boolean;
  onToggleCompare: (bus: Bus) => void;
  isFavorite: boolean;
  onToggleFavorite: (bus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  isOpen,
  onToggleDrawer,
  onProceedToBooking,
  onOpenRouteMap,
  onShareTrip,
  isCompared,
  onToggleCompare,
  isFavorite,
  onToggleFavorite,
}) => {
  // Choose custom SVG illustration based on bus type
  const busIllustration =
    bus.type === 'AC Sleeper'
      ? '/assets/illustrations/buses/bus-side-sleeper.svg'
      : bus.type === 'Non-AC Seater'
      ? '/assets/illustrations/buses/bus-side-local.svg'
      : '/assets/illustrations/buses/bus-side.svg';

  return (
    <div className="bus-card-wrapper" id={`bus-card-${bus.id}`}>
      {/* Top Header */}
      <div className="bus-card-top">
        <div>
          <div className="bus-operator-title">
            <span>{bus.name}</span>
            <button
              type="button"
              onClick={() => onToggleFavorite(bus)}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Heart
                size={18}
                fill={isFavorite ? 'var(--primary)' : 'none'}
                color={isFavorite ? 'var(--primary)' : 'var(--text-muted)'}
              />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="bus-type-pill">{bus.type}</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--success)',
                color: 'white',
                padding: '2px 7px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginTop: '0.35rem',
              }}
            >
              <Star size={11} fill="white" />
              <span>{bus.rating.toFixed(1)}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              ({bus.reviewsCount} ratings)
            </span>
          </div>
        </div>

        {/* Fare Column */}
        <div className="bus-price-box">
          <div className="price-main">₹{bus.price}</div>
          <div className="price-tag-sub">all taxes included</div>
        </div>
      </div>

      {/* Route Timeline with custom route-connector */}
      <div className="route-timeline-row">
        <div className="time-city-col">
          <span className="time-val">{bus.departureTime}</span>
          <span className="city-val">{bus.from}</span>
        </div>

        <div className="route-connector-line">
          <span className="duration-badge">{bus.duration}</span>
          <Image
            src="/assets/illustrations/roads/route-connector.svg"
            alt="Route Journey"
            width={200}
            height={12}
            className="road-connector-img"
          />
        </div>

        <div className="time-city-col" style={{ textAlign: 'right' }}>
          <span className="time-val">{bus.arrivalTime}</span>
          <span className="city-val">{bus.to}</span>
        </div>
      </div>

      {/* Card Footer Actions & Amenities */}
      <div className="bus-card-bottom">
        <div className="amenities-badges-row">
          {bus.amenities.slice(0, 4).map((amenity) => (
            <span key={amenity} className="amenity-chip">
              {amenity === 'WiFi' && <Wifi size={12} />}
              {amenity === 'Charging Point' && <BatteryCharging size={12} />}
              <span>{amenity}</span>
            </span>
          ))}

          {/* Route Map Action */}
          <button
            type="button"
            className="btn-ghost"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => onOpenRouteMap(bus)}
            title="View stops & route map"
          >
            <Map size={13} />
            <span>Stops & Map</span>
          </button>

          {/* Share Action */}
          <button
            type="button"
            className="btn-ghost"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => onShareTrip(bus)}
            title="Share bus details"
          >
            <Share2 size={13} />
          </button>

          {/* Compare Checkbox */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              marginLeft: '0.4rem',
            }}
          >
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onToggleCompare(bus)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Compare</span>
          </label>
        </div>

        <div className="card-action-group">
          <div className={`seats-count-badge ${bus.available_seats <= 10 ? 'low' : ''}`}>
            {bus.available_seats} Seats Available
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => onToggleDrawer(bus.id)}
            style={{ padding: '0.55rem 1.3rem', fontSize: '0.9rem' }}
          >
            {isOpen ? 'Close Cabin' : 'View Seats'}
          </button>
        </div>
      </div>

      {/* Expandable Seat Drawer */}
      {isOpen && (
        <SeatDrawer
          bus={bus}
          onClose={() => onToggleDrawer(bus.id)}
          onProceedToBooking={onProceedToBooking}
        />
      )}
    </div>
  );
};
