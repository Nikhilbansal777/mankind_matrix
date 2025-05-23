import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import useProducts from '../../../hooks/useProducts';
import withLayout from '../../../layouts/HOC/withLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductView.css';

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Error Loading Product</h2>
        <p>There was an error loading the product details. Please try again later.</p>
        <a href="/products">Back to Products</a>
      </div>
    );
  }

  // For demo purposes, a placeholder image if no image URL is provided
  const imageUrl = product.imageUrl || `https://via.placeholder.com/500x400.png?text=${product.name}`;

  return (
    <div className="product-page-container">
      <ToastContainer />
      
      <div className="product-details">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.name} className="product-image" />
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-category">Category: <span>{product.category}</span></div>
          <div className="product-price">Price: <span>{product.price}</span></div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.shortDescription}</p>
            {product.longDescription && <p>{product.longDescription}</p>}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
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
            
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          
          {product.specifications && (
            <div className="product-specifications">
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