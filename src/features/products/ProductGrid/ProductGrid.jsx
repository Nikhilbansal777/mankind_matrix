import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import useProducts from '../../../hooks/useProducts';
import './ProductGrid.css';

const ProductGrid = ({ searchQuery, category }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  
  const {
    products,
    loading,
    error,
    pagination,
    getProducts
  } = useProducts();
  
  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const pageIndex = currentPage - 1; // API uses 0-based indexing
        await getProducts(pageIndex, productsPerPage);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    
    loadProducts();
  }, [currentPage, productsPerPage, getProducts]);

  // Adjust products per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setProductsPerPage(4);
      } else if (window.innerWidth <= 992) {
        setProductsPerPage(6);
      } else {
        setProductsPerPage(8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products using useMemo for better performance
  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (category) {
      result = result.filter(p => p.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [products, searchQuery, category]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of product grid when changing pages
    window.scrollTo({
      top: document.querySelector('.product-grid-container').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="product-not-found">
        <h2>No Products Found</h2>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductGrid;