'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeftRight, MapPin, Calendar, Search, Sparkles, Navigation } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (from: string, to: string, date: string) => void;
  recentSearches: { from: string; to: string }[];
  onSelectRecent: (from: string, to: string) => void;
}

const POPULAR_CITIES = [
  'Delhi',
  'Jaipur',
  'Mumbai',
  'Pune',
  'Bangalore',
  'Chennai',
  'Chandigarh',
  'Shimla',
  'Hyderabad',
  'Vijayawada',
  'Goa',
  'Manali',
  'Mysore',
  'Pondicherry',
  'Noida',
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  recentSearches,
  onSelectRecent,
}) => {
  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Jaipur');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => setIsSwapping(false), 300);
    onSearch(to, temp, date);
  };

  const handleDateQuickSelect = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const str = d.toISOString().split('T')[0];
    setDate(str);
    onSearch(from, to, str);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFromSuggestions([]);
    setToSuggestions([]);
    onSearch(from, to, date);
  };

  return (
    <section className="safar-hero">
      {/* Hand-drawn Travel Doodles Float */}
      <div className="doodle-float" style={{ top: '15%', left: '4%', width: 70, height: 70 }}>
        <Image src="/assets/illustrations/doodles/sun.svg" alt="Sun" width={70} height={70} />
      </div>
      <div className="doodle-float" style={{ top: '25%', right: '5%', width: 85, height: 85 }}>
        <Image src="/assets/illustrations/doodles/suitcase.svg" alt="Suitcase" width={85} height={85} />
      </div>
      <div className="doodle-float" style={{ bottom: '10%', left: '8%', width: 65, height: 65 }}>
        <Image src="/assets/illustrations/doodles/compass.svg" alt="Compass" width={65} height={65} />
      </div>
      <div className="doodle-float" style={{ bottom: '15%', right: '9%', width: 95, height: 95 }}>
        <Image src="/assets/illustrations/doodles/mountains.svg" alt="Mountains" width={95} height={95} />
      </div>

      <div className="hero-inner">
        <div className="hero-pill-badge">
          <Sparkles size={16} color="var(--primary)" />
          <span>India&apos;s Most Reliable Intercity Bus Network</span>
        </div>

        <h1 className="hero-title">
          Travel freely across India with <span>Safar</span>.
        </h1>

        <p className="hero-subtitle">
          Verified fleets, real-time seat availability, zero hidden fees, and seamless online booking.
          <span className="handwritten" style={{ display: 'block', marginTop: '0.4rem' }}>
            ~ your journey, crafted with care ✨
          </span>
        </p>

        {/* Search Widget */}
        <div className="search-widget-wrapper">
          <form className="search-box-grid" onSubmit={handleSubmit}>
            {/* Origin */}
            <div className="search-input-field">
              <label className="search-input-label" htmlFor="search-from">
                <MapPin size={14} color="var(--primary)" />
                <span>From City</span>
              </label>
              <input
                id="search-from"
                type="text"
                placeholder="Origin (e.g. Delhi)"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  const q = e.target.value.toLowerCase().trim();
                  setFromSuggestions(
                    q ? POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q) && c !== to) : []
                  );
                }}
                onFocus={() => {
                  if (from) {
                    setFromSuggestions(
                      POPULAR_CITIES.filter((c) => c.toLowerCase().includes(from.toLowerCase()) && c !== to)
                    );
                  }
                }}
                autoComplete="off"
              />
              {fromSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 50,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {fromSuggestions.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setFrom(city);
                        setFromSuggestions([]);
                      }}
                      style={{
                        padding: '0.6rem 1rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--warm-ivory)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Navigation size={13} color="var(--text-muted)" />
                      <span>{city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              type="button"
              className="search-swap-btn"
              onClick={handleSwap}
              title="Swap From and To"
              aria-label="Swap cities"
              style={{
                transform: isSwapping ? 'rotate(180deg) scale(1.1)' : undefined,
              }}
            >
              <ArrowLeftRight size={18} />
            </button>

            {/* Destination */}
            <div className="search-input-field">
              <label className="search-input-label" htmlFor="search-to">
                <MapPin size={14} color="var(--muted-teal)" />
                <span>To Destination</span>
              </label>
              <input
                id="search-to"
                type="text"
                placeholder="Destination (e.g. Jaipur)"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  const q = e.target.value.toLowerCase().trim();
                  setToSuggestions(
                    q ? POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q) && c !== from) : []
                  );
                }}
                onFocus={() => {
                  if (to) {
                    setToSuggestions(
                      POPULAR_CITIES.filter((c) => c.toLowerCase().includes(to.toLowerCase()) && c !== from)
                    );
                  }
                }}
                autoComplete="off"
              />
              {toSuggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 50,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {toSuggestions.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setTo(city);
                        setToSuggestions([]);
                      }}
                      style={{
                        padding: '0.6rem 1rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--warm-ivory)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Navigation size={13} color="var(--text-muted)" />
                      <span>{city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Input with Quick Selectors */}
            <div className="search-input-field">
              <label className="search-input-label" htmlFor="search-date">
                <Calendar size={14} color="var(--primary)" />
                <span>Travel Date</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="search-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDateQuickSelect(0)}
                  style={{
                    background: 'var(--warm-ivory)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleDateQuickSelect(1)}
                  style={{
                    background: 'var(--warm-ivory)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  Tmrw
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="search-submit-btn">
              <Search size={18} />
              <span>Search Buses</span>
            </button>
          </form>

          {/* Recently Searched Routes */}
          {recentSearches.length > 0 && (
            <div className="recent-routes-bar">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Recent Searches:
              </span>
              {recentSearches.slice(0, 4).map((r, i) => (
                <button
                  key={i}
                  type="button"
                  className="route-chip"
                  onClick={() => {
                    setFrom(r.from);
                    setTo(r.to);
                    onSelectRecent(r.from, r.to);
                  }}
                >
                  <span>
                    {r.from} ➔ {r.to}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
