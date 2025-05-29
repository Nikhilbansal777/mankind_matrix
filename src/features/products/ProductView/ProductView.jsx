import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import useProducts from '../../../hooks/useProducts';
import withLayout from '../../../layouts/HOC/withLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ProductView.module.css';

const ProductView = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { addToCart } = useCart();
  const { 
    currentProduct: product,
    loading, 
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

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      toast.success(`${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${product.name} added to cart!`, {
        position: 'bottom-center'
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Product</h2>
        <p>There was an error loading the product details. Please try again later.</p>
        <a href="/products">Back to Products</a>
      </div>
    );
  }

  // For demo purposes, a placeholder image if no image URL is provided
  const imageUrl = product.imageUrl || `https://via.placeholder.com/500x400.png?text=${product.name}`;

  return (
    <div className={styles.productPageContainer}>
      <ToastContainer />
      
      <div className={styles.productDetails}>
        <div className={styles.productImageContainer}>
          <img src={imageUrl} alt={product.name} className={styles.productImage} />
        </div>
        
        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.productCategory}>Category: <span>{product.category}</span></div>
          <div className={styles.productPrice}>Price: <span>{product.price}</span></div>
          
          <div className={styles.productDescription}>
            <h3>Description</h3>
            <p>{product.shortDescription}</p>
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
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart
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
};

export default withLayout(ProductView); 