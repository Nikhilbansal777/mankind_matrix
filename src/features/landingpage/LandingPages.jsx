import React, { useState, useEffect } from 'react';
import './LandingPages.css';
import withLayout from '../../layouts/HOC/withLayout';
import { getAllProducts } from '../../api/productService';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingPages = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts(0, 6); // Get first 6 products
        setFeaturedProducts(response.content);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error loading products:', err);
      }
    };
    
    loadProducts();
  }, []);

  const showToaster = (type) => {
    if (type === "success") {
      toast.success("Success message !!", {
        position: 'bottom-center'
      });
    }
    else if (type === "error") {
      toast.error("Error message !!", {
        position: 'bottom-center'
      });
    }
  }

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mankind Matrix</h1>
          <p>Discover the future of digital innovation</p>
          <button className="cta-button">Learn More</button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="featured-products-carousel">
            <Slider {...carouselSettings}>
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} />
                    )}
                  </div>
                  <div className="product-info">
                    <h2>{product.name}</h2>
                    <p>{product.shortDescription}</p>
                    <div className="product-details">
                      <span className="price">${product.price}</span>
                      <span className="category">{product.category}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="learn-more">
                      Learn more &gt;
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </section>

      {/* Innovation Section */}
      <section className="innovation-section">
        <div className="innovation-content">
          <h2>Innovation at Scale</h2>
          <p>Pushing boundaries, creating possibilities</p>
          <button className="secondary-button">Explore</button>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform?</h2>
          <p>Join us in shaping the future</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default withLayout(LandingPages); 