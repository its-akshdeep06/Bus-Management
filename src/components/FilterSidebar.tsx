'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { BusType, Amenity } from '@/types';

interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
  maxPrice: number;
  onPriceChange: (val: number) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const BUS_TYPES: BusType[] = [
  'AC Sleeper',
  'Volvo AC',
  'AC Semi-Sleeper',
  'AC Seater',
  'Non-AC Seater',
];

const AMENITIES: Amenity[] = [
  'WiFi',
  'Charging Point',
  'Blanket',
  'Water Bottle',
  'Live Tracking',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedTypes,
  onTypeToggle,
  selectedAmenities,
  onAmenityToggle,
  maxPrice,
  onPriceChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const hasActiveFilters =
    selectedTypes.length > 0 || selectedAmenities.length > 0 || maxPrice < 2500;

  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          <SlidersHorizontal size={17} color="var(--primary)" />
          <span>Filter Buses ({totalFilteredCount})</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Bus Type Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">Bus Type</h4>
        {BUS_TYPES.map((type) => (
          <label key={type} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => onTypeToggle(type)}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>

      {/* Max Fare Filter */}
      <div className="filter-section">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <h4 className="filter-section-title" style={{ marginBottom: 0 }}>
            Max Fare
          </h4>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
            ₹{maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="150"
          max="2500"
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            marginTop: '0.3rem',
          }}
        >
          <span>₹150</span>
          <span>₹2500</span>
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="filter-section">
        <h4 className="filter-section-title">Amenities</h4>
        {AMENITIES.map((amenity) => (
          <label key={amenity} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={() => onAmenityToggle(amenity)}
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>

      {/* Assurance Box */}
      <div
        style={{
          background: 'var(--warm-ivory)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--border-light)',
          marginTop: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            marginBottom: '0.3rem',
          }}
        >
          <ShieldCheck size={16} color="var(--success)" />
          <span>Safar Assured</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          All listed fleets are sanitised, safety-certified, and punctual.
        </p>
      </div>
    </aside>
  );
};
