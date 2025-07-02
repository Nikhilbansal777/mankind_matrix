import React, { memo } from 'react';
import './SortDropdown.css';

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'name,asc', label: 'Name (A-Z)' },
  { value: 'name,desc', label: 'Name (Z-A)' },
  { value: 'inventory.price,asc', label: 'Price (Low to High)' },
  { value: 'inventory.price,desc', label: 'Price (High to Low)' },
  { value: 'createdAt,desc', label: 'Newest Arrivals' },
  { value: 'inventory.availableQuantity,desc', label: 'Stock (High to Low)' },
  { value: 'inventory.availableQuantity,asc', label: 'Stock (Low to High)' },
];

const SortDropdown = ({ onSortChange, selectedSort }) => {
  return (
    <div className="sort-dropdown-container">
      <label htmlFor="sort-select" className="sort-label">Sort by:</label>
      <select 
        id="sort-select"
        className="sort-select"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(SortDropdown); 