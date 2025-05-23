import React, { useState } from 'react';
import './LandingPage.css';
import HighlightedProductsCarousel from '../products/HighlightedProductsCarousel';
import SidebarFilters from '../products/Filters/SidebarFilters';
import ProductGrid from '../products/ProductGrid';
import withLayout from '../../layouts/HOC/withLayout';
import { ToastContainer, toast } from 'react-toastify';

const LandingPage = () => {
  const [searchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  
  return (
    <>
      <HighlightedProductsCarousel />

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
            <SidebarFilters onFilterChange={setSelectedCategory} />
          </div>
          
          {/* Product grid */}
          <div className="product-grid-container">
            <ProductGrid 
              searchQuery={searchQuery} 
              category={selectedCategory} 
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default withLayout(LandingPage);
