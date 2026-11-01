'use client';

import React from 'react';

interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  availableTypes?: string[];
}

const DEFAULT_TYPES = [
  'AC Sleeper',
  'AC Semi-Sleeper',
  'Volvo AC',
  'Non-AC Seater',
  'AC Seater',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedTypes,
  onTypeToggle,
  availableTypes = DEFAULT_TYPES,
}) => {
  return (
    <aside className="sidebar-filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <h4>Bus Type</h4>
        {availableTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={() => onTypeToggle(type)}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

