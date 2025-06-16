import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Slider from 'react-slick';
import ProductHighlightCard from './ProductHighlightCard';
import useProducts from '../../../hooks/useProducts';
import './HighlightedProductsCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Arrow components for navigation
const PrevArrow = React.memo(({ onClick }) => (
  <div className="custom-arrow custom-prev" onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </div>
));

const NextArrow = React.memo(({ onClick }) => (
  <div className="custom-arrow custom-next" onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </div>
));

// Memoize the ProductHighlightCard component
const MemoizedProductHighlightCard = React.memo(ProductHighlightCard);

const ITEMS_PER_PAGE = 5;

const HighlightedProductsCarousel = React.memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { 
    featuredProducts,
    featuredLoading, 
    error, 
    getFeaturedProducts 
  } = useProducts();

  // Use ref to track if data has been fetched
  const hasFetchedRef = useRef(false);

  // Fetch featured products only once on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      const loadFeaturedProducts = async () => {
        try {
          await getFeaturedProducts();
          hasFetchedRef.current = true;
        } catch (err) {
          // Error is handled by the error state
        }
      };
      
      loadFeaturedProducts();
    }
  }, [getFeaturedProducts]);

  // Memoize products array and calculations
  const { products, totalPages } = useMemo(() => {
    const productsArray = Array.isArray(featuredProducts) ? featuredProducts : [];
    return {
      products: productsArray,
      totalPages: Math.ceil(productsArray.length / ITEMS_PER_PAGE)
    };
  }, [featuredProducts]);
  
  // Memoize slider settings
  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true
        }
      }
    ]
  }), []);

  // Reference to the slider
  const sliderRef = useRef(null);

  // Memoize navigation handlers
  const goToPrev = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  }, []);

  const goToNext = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, []);

  const goToSlide = useCallback((index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index * ITEMS_PER_PAGE);
    }
  }, []);

  // Memoize custom dots component
  const renderCustomDots = useCallback(() => {
    return (
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#101820' : '#ccc',
              margin: '0 5px',
              cursor: 'pointer',
              transform: currentSlide === index ? 'scale(1.3)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    );
  }, [currentSlide, totalPages, goToSlide]);

  // Memoize the main content
  const mainContent = useMemo(() => (
    <div className="highlighted-products-container">
      <Slider ref={sliderRef} {...settings}>
        {products.map(product => (
          <div key={product.id} className="carousel-item">
            <MemoizedProductHighlightCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  ), [products, settings]);

  // Memoize loading state
  const loadingContent = useMemo(() => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading featured products...</p>
    </div>
  ), []);

  // Memoize error state
  const errorContent = useMemo(() => (
    <div className="error-container">
      <h2>Error Loading Featured Products</h2>
      <p>{error}</p>
    </div>
  ), [error]);

  // Memoize empty state
  const emptyContent = useMemo(() => (
    <div className="product-not-found">
      <h2>No Featured Products</h2>
      <p>No featured products available at this time.</p>
    </div>
  ), []);

  // Return appropriate content based on state
  if (featuredLoading) return loadingContent;
  if (error) return errorContent;
  if (!products.length) return emptyContent;
  return mainContent;
});

HighlightedProductsCarousel.displayName = 'HighlightedProductsCarousel';

export default HighlightedProductsCarousel;