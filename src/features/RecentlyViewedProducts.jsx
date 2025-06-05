import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecentlyViewedProducts.css';

const RecentlyViewedProducts = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Get recently viewed products from localStorage
    const viewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
    setRecentlyViewed(viewedProducts);
  }, []);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="recently-viewed-section">
      <h2 className="section-title">Recently Viewed Products</h2>
      <div className="recently-viewed-grid">
        {recentlyViewed.map((product) => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="product-card"
          >
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts; 