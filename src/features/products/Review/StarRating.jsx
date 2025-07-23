import React from 'react';

const StarRating = ({ rating, editable = false, onChange, value }) => {
  const displayValue = typeof value === 'number' ? value : rating;

  const handleClick = (i) => {
    if (editable && onChange) {
      onChange(i + 1);
    }
  };

  return (
    <div className="star-rating" style={{ cursor: editable ? 'pointer' : 'default', fontSize: '1.2em' }}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{ color: i < displayValue ? '#f5a623' : '#ccc', transition: 'color 0.2s' }}
          onClick={() => handleClick(i)}
          data-testid={`star-${i}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating; 