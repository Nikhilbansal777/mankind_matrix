import React, { useEffect, useCallback, useRef } from 'react';
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
    removeFromRecentlyViewed, 
    clearRecentlyViewed
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

  // Extract product data from the recently viewed structure
  // API returns: [{id, lastViewedAt, product: {...}, userId, viewedAt}]
  const extractedProducts = recentlyViewed && Array.isArray(recentlyViewed)
    ? recentlyViewed.map(item => ({
        ...item.product, // Spread the product data
        lastViewedAt: item.lastViewedAt,
        viewedAt: item.viewedAt
      }))
    : [];

  // Friendly error message for 401
  let friendlyMessage = 'Error loading recently viewed products';
  if (error && (error.status === 401 || (typeof error === 'string' && error.includes('401')))) {
    friendlyMessage = 'Please log in to view your recently viewed products.';
  }

  const scrollRef = useRef(null);

  const scrollByAmount = 300; // px

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
    }
  };

  if(recentlyViewed.length === 0){
    return null;
  }

  return (
    <div className="recently-viewed-section">
      <div className="section-title-row">
        <h2 className="section-title centered-title">Recently Viewed Products</h2>
        {extractedProducts.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={clearRecentlyViewed}
            disabled={loading && loading.remove}
          >
            Clear All
          </button>
        )}
      </div>

      {loading && loading.fetch && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recently viewed products...</p>
        </div>
      )}

      {error && (
        <div className='message'>
          <p>{friendlyMessage}</p>
        </div>
      )}


      {!loading.fetch && !error && extractedProducts.length > 0 && (
        <div className="recently-viewed-scroll-wrapper">
          <button className="scroll-arrow left" onClick={handleScrollLeft} aria-label="Scroll left">&#8592;</button>
          <div className="recently-viewed-row" ref={scrollRef}>
            {extractedProducts.map((product) => {
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
                    <button
                      className="remove-button"
                      onClick={(e) => handleRemoveProduct(product.id, e)}
                      title="Remove from recently viewed"
                      disabled={loading && loading.remove}
                    >
                      ×
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
          <button className="scroll-arrow right" onClick={handleScrollRight} aria-label="Scroll right">&#8594;</button>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewedProducts; 