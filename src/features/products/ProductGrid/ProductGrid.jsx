import React, { useEffect, useMemo, memo } from 'react';
import ProductCard from './ProductCard';
import Pagination from '../../../components/Pagination/Pagination';
import useProducts from '../../../hooks/useProducts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductGrid.css';


const ProductGrid = memo(({ 
  searchQuery, 
  category,
  currentPage,
  productsPerPage,
  onPageChange,
}) => {
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
        // Error is handled by the error state
        console.error('Error loading products:', err);
      }
    };
    
    loadProducts();
  }, [currentPage, productsPerPage, getProducts]);

  // Filter products using useMemo for better performance
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let result = products;
    
    if (category) {
      result = result.filter(p => {
        const productCategory = typeof p.category === 'object' ? p.category?.name : p.category;
        return productCategory === category;
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.name?.toLowerCase() || '').includes(query) ||
        ((p.shortDescription?.toLowerCase() || '').includes(query))
      );
    }
    
    return result;
  }, [products, searchQuery, category]);

  // Memoize toast container settings
  const toastContainerProps = useMemo(() => ({
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light"
  }), []);

  if (loading.products) {
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
      <ToastContainer {...toastContainerProps} />
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;