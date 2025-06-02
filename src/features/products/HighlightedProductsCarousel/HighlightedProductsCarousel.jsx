import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ProductHighlightCard from './ProductHighlightCard';
import useProducts from '../../../hooks/useProducts';
import './HighlightedProductsCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Arrow components for navigation
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-prev" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </div>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-next" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </div>
  );
};

const HighlightedProductsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { 
    featuredProducts,
    loading, 
    error, 
    getFeaturedProducts 
  } = useProducts();

  // Fetch featured products
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await getFeaturedProducts();
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    };
    
    loadFeaturedProducts();
  }, [getFeaturedProducts]);

  // Calculate number of pages (for dots)
  const itemsPerPage = 5; // Match slidesToShow
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage);
  
  // Settings for react-slick carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
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
  };

  // Reference to the slider
  const sliderRef = React.useRef(null);

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // Go to specific slide
  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index * itemsPerPage);
    }
  };

  // Custom dots component
  const renderCustomDots = () => {
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
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Featured Products</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="product-not-found">
        <h2>No Featured Products</h2>
        <p>No featured products available at this time.</p>
      </div>
    );
  }

  return (
    <div className="highlighted-products-container">
      <Slider ref={sliderRef} {...settings}>
        {featuredProducts.map(product => (
          <div key={product.id} className="carousel-item">
            <ProductHighlightCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HighlightedProductsCarousel;