import React, { useEffect, useMemo, memo } from 'react';
import ProductCard from './ProductCard';
import Pagination from '../../../components/Pagination/Pagination';
import useProducts from '../../../hooks/useProducts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductGrid.css';
import reviewService from '../../../api2/services/reviewService';


const ProductGrid = memo(({ 
  searchQuery, 
  category,
  currentPage,
  productsPerPage,
  onPageChange,
  sortOption,
}) => {
  const {
    products,
    loading,
    error,
    pagination,
    getProducts,
    getProductsByCategory
  } = useProducts();
  
  const [productRatings, setProductRatings] = React.useState({});

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const pageIndex = currentPage - 1;
        const sortArr = sortOption ? [sortOption] : [];
        if (category) {
          // If category is selected, fetch products by category
          await getProductsByCategory(category, pageIndex, productsPerPage, sortArr);
        } else {
          // If no category selected (null), fetch all products
          await getProducts(pageIndex, productsPerPage, sortArr);
        }
      } catch (err) {
        // Error is handled by the error state
        console.error('Error loading products:', err);
      }
    };
    
    loadProducts();
  }, [currentPage, productsPerPage, category, sortOption, getProducts, getProductsByCategory]);

  // Filter products using useMemo for better performance (only search filtering now)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let result = products;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.name?.toLowerCase() || '').includes(query) ||
        (p.description?.toLowerCase() || '').includes(query) ||
        (p.shortDescription?.toLowerCase() || '').includes(query)
      );
    }
    
    return result;
  }, [products, searchQuery]);

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

  useEffect(() => {
    if (filteredProducts.length > 0) {
      Promise.all(filteredProducts.map(product =>
        reviewService.getReviews(product.id).then(reviews => {
          const valid = Array.isArray(reviews) ? reviews.filter(r => r && typeof r.rating === 'number') : [];
          const average = valid.length > 0 ? (valid.reduce((sum, r) => sum + r.rating, 0) / valid.length) : null;
          return [product.id, { average, count: valid.length, reviews: valid }];
        })
      )).then(results => {
        setProductRatings(Object.fromEntries(results));
      });
    }
  }, [filteredProducts]);

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
            averageRating={productRatings[product.id]?.average}
            reviewCount={productRatings[product.id]?.count}
            reviews={productRatings[product.id]?.reviews}
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