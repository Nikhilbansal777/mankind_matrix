import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecentlyViewedProducts.css';
import { formatCurrency } from '../utils/formatCurrency';

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
        {recentlyViewed.map((product) => {
          const imageUrl =
            (Array.isArray(product.images) && product.images[0]) ||
            product.image ||
            'https://placehold.co/200x150?text=No+Image';
          console.log('Product object:', product);
          const price = product.inventoryStatus?.price;
          const formattedPrice = price != null && !isNaN(price) ? formatCurrency(price) : 'Price not available';
          return (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id} 
              className="product-card"
            >
              <div className="product-image-container">
                <img 
                  src={imageUrl} 
                  alt={product.name} 
                  className="product-image"
                  width={200}
                  height={150}
                  style={{ objectFit: 'contain', background: '#fff', display: 'block', margin: '0 auto' }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formattedPrice}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts; 