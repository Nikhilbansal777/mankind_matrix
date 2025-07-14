import React, { useEffect, useState } from 'react';
import reviewService from '../../../api2/services/reviewService';
import StarRating from '../../../api/Starrating';

const ProductAverageRating = ({ average, count, starsOnly }) => {

  if (starsOnly) {
    return <StarRating rating={average} />;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8, padding: '4px 12px', fontWeight: 600 }}>
        <span style={{ fontSize: 18 }}>{average.toFixed(1)}</span>
        <StarRating rating={average} />
        <span style={{ color: '#888', fontSize: 14 }}>({count})</span>
    </div>
  );
};

export default ProductAverageRating; 