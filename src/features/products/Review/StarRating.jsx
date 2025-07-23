import React from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.round(rating);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < fullStars ? '#f5a623' : '#ccc' }}>★</span>
      ))}
    </div>
  );
};

export default StarRating; 