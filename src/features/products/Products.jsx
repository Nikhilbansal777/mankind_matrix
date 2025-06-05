import React, { useState, useCallback, memo } from 'react';
import withLayout from '../../layouts/HOC/withLayout';
import ProductGrid from './ProductGrid';
import SidebarFilters from './Filters/SidebarFilters';
import './Products.css';
import Sidebar from '../../layouts/components/sidebar';

// Memoize the Sidebar component to prevent unnecessary re-renders
const MemoizedSidebar = memo(Sidebar);

const ProductsPage = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  // Handler for search input with debounce
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  // Handler for category filter
  const handleCategoryFilter = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  }, []);

  // Handler for page change
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products section when changing pages
    const productsSection = document.querySelector('.products-content');
    if (productsSection) {
      window.scrollTo({
        top: productsSection.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }, []);

  // Memoize search input handler
  const handleSearchInput = useCallback((e) => {
    handleSearch(e.target.value);
  }, [handleSearch]);

  return (
    <div className='d-flex'>
      <MemoizedSidebar />
      <div className="products-page">
        <div className="products-header">
          <h1>Our Products</h1>
          <div className="filter-container">
            <SidebarFilters onFilterChange={handleCategoryFilter} />
          </div>
        </div>
        
        <div className="products-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="product-search-input"
            />
          </div>
          
          <div className="product-grid-container">
            <ProductGrid 
              searchQuery={searchQuery} 
              category={selectedCategory}
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ProductsPage.displayName = 'ProductsPage';

export default withLayout(ProductsPage);