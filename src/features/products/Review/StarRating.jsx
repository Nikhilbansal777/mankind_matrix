import React from 'react';

const StarRating = ({ rating, editable = false, onChange, value }) => {
  const displayValue = typeof value === 'number' ? value : rating;

  const handleClick = (i) => {
    if (editable && onChange) {
      onChange(i + 1);
    }
  };

  const handleKeyDown = (e, i) => {
    if (!editable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(i + 1);
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      onChange(i);
    } else if (e.key === 'ArrowRight' && i < 4) {
      e.preventDefault();
      onChange(i + 2);
    }
  };

  return (
    <div
      className="star-rating"
      style={{ cursor: editable ? 'pointer' : 'default', fontSize: '1.2em' }}
      role={editable ? 'radiogroup' : undefined}
      aria-label="Star rating"
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{ color: i < displayValue ? '#f5a623' : '#ccc', transition: 'color 0.2s' }}
          onClick={() => handleClick(i)}
          tabIndex={editable ? 0 : -1}
          role={editable ? 'radio' : undefined}
          aria-checked={editable ? i + 1 === displayValue : undefined}
          aria-label={`${i + 1} star`}
          onKeyDown={editable ? (e) => handleKeyDown(e, i) : undefined}
          data-testid={`star-${i}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating; 