import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import useProducts from '../../../hooks/useProducts';
import withLayout from '../../../layouts/HOC/withLayout';
import { ToastContainer, toast } from 'react-toastify';
import { formatCurrency } from '../../../utils/formatCurrency';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ProductView.module.css';

const ProductView = memo(() => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { addToCart } = useCart();
  const { 
    currentProduct: product,
    currentProductLoading: loading,
    error,
    getProduct,
    clearProduct 
  } = useProducts();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await getProduct(id);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    loadProduct();
    
    // Cleanup function to clear the current product when component unmounts
    return () => {
      clearProduct();
    };
  }, [id, getProduct, clearProduct]);

  // Add to recently viewed products
  useEffect(() => {
    if (product) {
      const addToRecentlyViewed = (product) => {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
        // Remove the product if it already exists
        const filteredProducts = recentlyViewed.filter(p => p.id !== product.id);
        // Add the product to the beginning of the array, saving images and inventoryStatus
        const updatedProducts = [{
          id: product.id,
          name: product.name,
          images: product.images,
          inventoryStatus: product.inventoryStatus,
        }, ...filteredProducts].slice(0, 6); // Keep only last 6 products
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(updatedProducts));
      };
      addToRecentlyViewed(product);
    }
  }, [product]);
  // Safely get category name
  const getCategoryName = useCallback(() => {
    if (!product?.category) return 'Uncategorized';
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category !== null) {
      return product.category.name || 'Uncategorized';
    }
    return 'Uncategorized';
  }, [product?.category]);

  // Get product price from inventory status
  const getProductPrice = useCallback(() => {
    // Check if we have a valid price in inventory status
    const price = product?.inventoryStatus?.price;
    if (price == null || isNaN(price)) {
      return null; // Return null instead of 0 to indicate missing price
    }
    return Number(price);
  }, [product?.inventoryStatus]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      const price = getProductPrice();
      
      if (price === null) {
        toast.error('This product is currently not available for purchase. Please try again later.', {
          position: 'bottom-center'
        });
        return;
      }
      
      const formattedProduct = {
        ...product,
        price: formatCurrency(price),
        quantity
      };
      addToCart(formattedProduct);
      toast.success(`${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${product.name} added to cart!`, {
        position: 'bottom-center'
      });
    }
  }, [product, quantity, addToCart, getProductPrice]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  }, []);

  // Memoize all content states at the top level
  const loadingContent = useMemo(() => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading product details...</p>
    </div>
  ), []);

  const errorContent = useMemo(() => (
    <div className={styles.errorContainer}>
      <h2>Error Loading Product</h2>
      <p>{error || 'There was an error loading the product details. Please try again later.'}</p>
      <Link to="/products">Back to Products</Link>
    </div>
  ), [error]);

  const productContent = useMemo(() => {
    if (!product) return null;
    
    const categoryName = getCategoryName();
    const imageUrl = product.images?.[0] || `https://via.placeholder.com/500x400.png?text=${product.name}`;
    const price = getProductPrice();
    const formattedPrice = price !== null ? formatCurrency(price) : 'Price not available';
    const isInStock = product.inventoryStatus?.status === 'IN_STOCK';
    const availableQuantity = product.inventoryStatus?.availableQuantity || 0;
    const hasPrice = price !== null;

    return (
      <div className={styles.productPageContainer}>
        <ToastContainer />
        
        <div className={styles.productDetails}>
          <div className={styles.productImageContainer}>
            <img 
              src={imageUrl} 
              alt={product.name} 
              className={styles.productImage}
              loading="lazy"
            />
          </div>
          
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.productCategory}>
              Category: <span>{categoryName}</span>
            </div>
            <div className={`${styles.productPrice} ${!hasPrice ? styles.priceNotAvailable : ''}`}>
              Price: <span>{formattedPrice}</span>
              {!hasPrice && (
                <span className={styles.priceMessage}>
                  (Price information is currently unavailable)
                </span>
              )}
            </div>
            
            <div className={styles.inventoryStatus}>
              <span className={`${styles.status} ${styles[isInStock ? 'inStock' : 'outOfStock']}`}>
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {isInStock && (
                <span className={styles.availableQuantity}>
                  {availableQuantity} units available
                </span>
              )}
            </div>
            
            <div className={styles.productDescription}>
              <h3>Description</h3>
              <p>{product.shortDescription || product.description || 'No description available'}</p>
              {product.longDescription && <p>{product.longDescription}</p>}
            </div>
            
            <div className={styles.productActions}>
              <div className={styles.quantitySelector}>
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={availableQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!isInStock || !hasPrice}
                />
              </div>
              
              <button 
                className={`${styles.addToCartBtn} ${!hasPrice ? styles.disabled : ''}`}
                onClick={handleAddToCart}
                disabled={!isInStock || !hasPrice}
              >
                {!hasPrice ? 'Price Not Available' : isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {product.specifications && (
              <div className={styles.productSpecifications}>
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [product, quantity, getCategoryName, getProductPrice, handleQuantityChange, handleAddToCart]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await getProduct(id);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    loadProduct();
    
    // Cleanup function to clear the current product when component unmounts
    return () => {
      clearProduct();
    };
  }, [id, getProduct, clearProduct]);

  // Render logic after all hooks
  if (loading) return loadingContent;
  if (error) return errorContent;
  if (!product) return loadingContent; // Show loading while product is null
  return productContent;
});

ProductView.displayName = 'ProductView';

export default withLayout(ProductView); 