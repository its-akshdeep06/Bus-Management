'use client';

import React from 'react';
import { Bus } from '@/types';
import { SeatDrawer } from './SeatDrawer';

interface BusCardProps {
  bus: Bus;
  isOpen: boolean;
  onToggleDrawer: (busId: number) => void;
  onContinueBooking: (bus: Bus, seatNumber: number) => void;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  isOpen,
  onToggleDrawer,
  onContinueBooking,
}) => {
  return (
    <div className="bus-card">
      <div className="bus-info-top">
        <div>
          <div className="operator-name">{bus.name}</div>
          <div className="bus-type-badge">{bus.type}</div>
        </div>
        <div className="price-action">
          <div className="price">{bus.price}</div>
        </div>
      </div>

      <div className="route-info">
        <div className="time-city">
          <span className="time-val">{bus.time}</span>
          <span className="city-val">{bus.from}</span>
        </div>
        <div className="connector" />
        <div className="time-city">
          <span className="time-val">--:--</span>
          <span className="city-val">{bus.to}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className={`seats-warning ${bus.available_seats <= 10 ? 'low' : ''}`}>
          {bus.available_seats} Seats Available
        </div>
        <button
          className="btn-view-seats"
          onClick={() => onToggleDrawer(bus.id)}
        >
          {isOpen ? 'Close Seats' : 'View Seats'}
        </button>
      </div>

      {isOpen && (
        <SeatDrawer
          bus={bus}
          onClose={() => onToggleDrawer(bus.id)}
          onContinue={onContinueBooking}
        />
      )}
    </div>
  );
};

