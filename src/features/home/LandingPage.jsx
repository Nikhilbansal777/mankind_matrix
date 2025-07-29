import React, { useState, useCallback, memo } from 'react';
import './LandingPage.css';
import HighlightedProductsCarousel from '../products/HighlightedProductsCarousel';
import SidebarFilters from '../products/Filters/SidebarFilters';
import ProductGrid from '../products/ProductGrid';
import withLayout from '../../layouts/HOC/withLayout';
import { ToastContainer, toast } from 'react-toastify';

// Memoize the HighlightedProductsCarousel to prevent unnecessary re-renders
const MemoizedHighlightedCarousel = memo(HighlightedProductsCarousel);

const LandingPage = () => {
  const [searchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [showBanner, setShowBanner] = useState(true);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products section when changing pages
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      window.scrollTo({
        top: productsSection.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  }, []);

  const showToaster = useCallback((type) => {
    if (type === "success") {
      toast.success("Success message !!", {
        position: 'bottom-center'
      });
    } else if (type === "error") {
      toast.error("Error message !!", {
        position: 'bottom-center'
      });
    }
  }, []);

  return (
    <>
      {/* Sale Banner */}
      {showBanner && (
        <div className="sale-banner fixed">
          <span className="sale-banner-icon">🔥</span>
          <span className="sale-banner-text">
            <b>Summer Sale!</b> Use code <b>SAVE10</b> for <b>10% OFF</b> on all products! <span className="sale-banner-limited">Limited time only.</span>
          </span>
          <button className="sale-banner-close" onClick={() => setShowBanner(false)} title="Close banner">&times;</button>
        </div>
      )}
      <div style={{ marginTop: showBanner ? '3.2rem' : 0 }} />
      <MemoizedHighlightedCarousel />
      <div>
        <button onClick={() => showToaster('success')}>Success</button>
        <button onClick={() => showToaster('error')}>Error</button>
        <ToastContainer />
      </div>
      <div className="main-content">
        <section className="products-section">
          {/* Products header */}
          <div className="products-header">
            <h2 className="products-title">Our Products</h2>
            <SidebarFilters onFilterChange={handleCategoryChange} />
          </div>
          {/* Product grid */}
          <div className="product-grid-container">
            <ProductGrid 
              searchQuery={searchQuery} 
              category={selectedCategory}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              onPageChange={handlePageChange}
              onProductsPerPageChange={setProductsPerPage}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default withLayout(LandingPage);
