import React, { useState } from 'react';
import withLayout from '../../layouts/HOC/withLayout';
import ProductGrid from '../products/ProductGrid';
import SidebarFilters from '../products/Filters/SidebarFilters';
import './Products.css';
import Sidebar from  '../../layouts/components/sidebar';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Handler for search input 
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handler for category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className='d-flex'>
    <Sidebar></Sidebar>
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
            onChange={(e) => handleSearch(e.target.value)}
            className="product-search-input"
          />
        </div>
        
        <div className="product-grid-container">
          <ProductGrid 
            searchQuery={searchQuery} 
            category={selectedCategory} 
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default withLayout(ProductsPage);