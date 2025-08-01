import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from './WishlistButton.module.css';

const API_BASE_URL = 'https://api.mankindmatrix.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const WishlistButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wishlistPanelRef = useRef(null);

  const fetchWishlist = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`);
      setWishlistItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setTimeout(() => fetchWishlist(retryCount + 1), RETRY_DELAY);
      } else {
        setError('Failed to load wishlist. Please check if the server is running.');
        setIsLoading(false);
        toast.error('Failed to load wishlist. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wishlistPanelRef.current && !wishlistPanelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/wishlist`, {
        data: { productId }
      });
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item from wishlist. Please try again.');
    }
  };

  const handleAddToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({
          ...product,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      handleRemoveFromWishlist(product.id);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className={styles.wishlistWrapper} ref={wishlistPanelRef}>
      {/* Wishlist Icon */}
      <div 
        className={`${styles.wishlistButton} ${wishlistItems.length > 0 ? styles.wishlistPulse : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaHeart />
        {wishlistItems.length > 0 && (
          <span className={styles.wishlistCount}>
            {wishlistItems.length}
          </span>
        )}
      </div>
      
      {/* Wishlist Panel */}
      {isOpen && (
        <div className={styles.wishlistPanel}>
          <div className={styles.wishlistHeader}>
            <h3>Your Wishlist</h3>
          </div>
          
          <div className={styles.wishlistContent}>
            {isLoading ? (
              <div className={styles.loading}>Loading wishlist...</div>
            ) : error ? (
              <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => fetchWishlist()} className={styles.retryButton}>
                  Retry
                </button>
              </div>
            ) : wishlistItems.length > 0 ? (
              <ul className={styles.wishlistItems}>
                {wishlistItems.map((item) => (
                  <li key={item.id} className={styles.wishlistItem}>
                    <div className={styles.itemImage}>
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className={styles.itemDetails}>
                      <Link to={`/product/${item.id}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <div className={styles.itemPrice}>
                        <span className={styles.currentPrice}>{item.price}</span>
                        {item.originalPrice && (
                          <span className={styles.originalPrice}>{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        className={styles.addToCartBtn}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <FaShoppingCart />
                      </button>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyWishlist}>
                <p>Your wishlist is empty</p>
                <Link to="/products" className={styles.continueShoppingBtn}>
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
          
          {wishlistItems.length > 0 && (
            <div className={styles.wishlistFooter}>
              <Link to="/wishlist" className={styles.viewAllBtn}>
                View All Items
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistButton; 