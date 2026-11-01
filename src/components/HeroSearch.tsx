'use client';

import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (from: string, to: string, date: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    onSearch(to, temp, date);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(from, to, date);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>India&apos;s No. 1 Online Bus Ticket Booking Site</h1>
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-field">
            <label htmlFor="search-from">FROM</label>
            <input
              type="text"
              id="search-from"
              placeholder="City or Stop (e.g. Delhi)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            title="Swap origin and destination"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight size={18} />
          </button>

          <div className="search-field">
            <label htmlFor="search-to">TO</label>
            <input
              type="text"
              id="search-to"
              placeholder="City or Stop (e.g. Jaipur)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="search-date">DATE</label>
            <input
              type="date"
              id="search-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button type="submit" className="search-btn">
            SEARCH BUSES
          </button>
        </form>
      </div>
    </section>
  );
};

