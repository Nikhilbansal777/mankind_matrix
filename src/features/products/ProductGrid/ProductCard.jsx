import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import './ProductCard.css';

const API_BASE_URL = 'https://api.mankindmatrix.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center'
    });
  };

  const handleWishlistToggle = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      if (isInWishlist) {
        await axios.delete(`${API_BASE_URL}/api/wishlist`, {
          data: { productId: product.id }
        });
        toast.success('Removed from wishlist');
      } else {
        const wishlistItem = {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl
        };
        await axios.post(`${API_BASE_URL}/api/wishlist`, wishlistItem);
        toast.success('Added to wishlist');
      }
      setIsInWishlist(!isInWishlist);
      setIsLoading(false);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setTimeout(() => handleWishlistToggle(retryCount + 1), RETRY_DELAY);
      } else {
        toast.error('Failed to update wishlist. Please check if the server is running.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        </Link>
        <button 
          className={`wishlist-button ${isLoading ? 'loading' : ''}`}
          onClick={() => !isLoading && handleWishlistToggle()}
          disabled={isLoading}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart style={{ width: '20px', height: '20px' }} />
          ) : (
            <FaRegHeart style={{ width: '20px', height: '20px' }} />
          )}
        </button>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-brand">{product.brand}</p>
        <div className="product-price">
          <span className="current-price">${product.price}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice}</span>
          )}
        </div>
      </div>
      <p>{product.shortDescription}</p>
      <ul>
        <li><strong>Category:</strong> {product.category}</li>
      </ul>
      <div className="actions">
        <Link to={`/product/${product.id}`}>
          <button>View Details</button>
        </Link>
        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;