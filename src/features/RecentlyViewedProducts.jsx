import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import './RecentlyViewedProducts.css';
import { formatCurrency } from '../utils/formatCurrency';

const RecentlyViewedProducts = () => {
  const { 
    recentlyViewed, 
    loading, 
    error, 
    getRecentlyViewed, 
    removeFromRecentlyViewed 
  } = useRecentlyViewed();

  useEffect(() => {
    // Fetch recently viewed products from API
    getRecentlyViewed();
  }, [getRecentlyViewed]);

  // Handle remove product from recently viewed
  const handleRemoveProduct = useCallback(async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFromRecentlyViewed(productId);
    } catch (err) {
      console.error('Error removing product from recently viewed:', err);
    }
  }, [removeFromRecentlyViewed]);

  if (loading.fetch) {
    return (
      <div className="recently-viewed-section">
        <h2 className="section-title">Recently Viewed Products</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recently viewed products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recently-viewed-section">
        <h2 className="section-title">Recently Viewed Products</h2>
        <div className="error-container">
          <p>Error loading recently viewed products</p>
        </div>
      </div>
    );
  }

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  // Extract product data from the recently viewed structure
  // API returns: [{id, lastViewedAt, product: {...}, userId, viewedAt}]
  const extractedProducts = recentlyViewed.map(item => ({
    ...item.product, // Spread the product data
    lastViewedAt: item.lastViewedAt,
    viewedAt: item.viewedAt
  }));


  return (
    <div className="recently-viewed-section">
      <h2 className="section-title">Recently Viewed Products</h2>
      <div className="recently-viewed-grid">
        {extractedProducts.map((product) => {
          console.log("productproduct", product)
          const imageUrl =
            (Array.isArray(product.images) && product.images[0]) ||
            product.image ||
            'https://placehold.co/200x150?text=No+Image';
          const price = product.inventoryStatus?.price;
          const formattedPrice = price != null && !isNaN(price) ? formatCurrency(price) : 'Price not available';
          return (
            
            <div key={product.id} className="product-card-wrapper">
              <Link 
                to={`/product/${product.id}`} 
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
               <button
                 className="remove-button"
                 onClick={(e) => handleRemoveProduct(product.id, e)}
                 title="Remove from recently viewed"
                 disabled={loading.remove}
               >
                 ×
               </button>
             </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts; 