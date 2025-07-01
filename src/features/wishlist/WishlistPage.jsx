import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaShare, FaRegHeart } from 'react-icons/fa';
import withLayout from '../../layouts/HOC/withLayout';
import styles from './WishlistPage.module.css';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get userId from localStorage or your auth system
      const userId = localStorage.getItem('userId') || '1'; // Default to 1 for testing
      
      // Add timeout and validate response
      const response = await api.get('/wishlist', {
        params: {
          userId: userId
        },
        timeout: 5000, // 5 second timeout
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Only accept 2xx status codes
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      setWishlistItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      
      let errorMessage = 'Failed to load wishlist. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your internet connection.';
      } else if (!error.response) {
        errorMessage += 'Cannot connect to server. Please check if the server is running.';
      } else if (error.response.status === 401) {
        errorMessage += 'Please log in to view your wishlist.';
      } else if (error.response.status === 404) {
        errorMessage += 'Wishlist not found.';
      } else {
        errorMessage += error.response?.data?.message || 'Please try again later.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
    }
  };

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await api.get('/api/health', { timeout: 3000 });
        // If health check passes, fetch wishlist
        fetchWishlist();
      } catch (error) {
        console.error('API Connection test failed:', error);
        setError('Cannot connect to server. Please check if the server is running.');
        setIsLoading(false);
        toast.error('Cannot connect to server. Please check if the server is running.');
      }
    };

    testConnection();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem('userId') || '1'; // Default to 1 for testing
      await api.delete('/wishlist', {
        params: {
          userId: userId
        },
        data: { productId }
      });
      
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
      setSelectedItems(prevSelected => prevSelected.filter(id => id !== productId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        existingCart.push({
          ...product,
          quantity: 1
        });
      }
      
      // Save updated cart
      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleAddSelectedToCart = async () => {
    try {
      const selectedProducts = wishlistItems.filter(item => selectedItems.includes(item.id));
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      selectedProducts.forEach(product => {
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          existingCart[existingItemIndex].quantity += 1;
        } else {
          existingCart.push({
            ...product,
            quantity: 1
          });
        }
      });
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success(`${selectedProducts.length} items added to cart`);
      
      // Clear selection after adding to cart
      setSelectedItems([]);
    } catch (error) {
      console.error('Error adding selected items to cart:', error);
      toast.error('Failed to add selected items to cart');
    }
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === wishlistItems.length
        ? []
        : wishlistItems.map(item => item.id)
    );
  };

  const handleShareWishlist = () => {
    try {
      const wishlistUrl = `${window.location.origin}/wishlist?items=${selectedItems.join(',')}`;
      navigator.clipboard.writeText(wishlistUrl);
      toast.success('Wishlist link copied to clipboard');
    } catch (error) {
      console.error('Error sharing wishlist:', error);
      toast.error('Failed to share wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.loading}>Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchWishlist} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className={`${styles.wishlistPage} ${styles.emptyWishlist}`}>
        <h1>Your Wishlist</h1>
        <div className={styles.emptyWishlistMessage}>
          <FaRegHeart size={64} className={styles.emptyHeartIcon} />
          <h2>Your Wishlist is Empty</h2>
          <p>Save items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
          <button 
            className={styles.continueShoppingBtn}
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.wishlistHeader}>
        <h1>Your Wishlist</h1>
        <div className={styles.wishlistActions}>
          <button 
            className={styles.shareBtn}
            onClick={handleShareWishlist}
            disabled={selectedItems.length === 0}
          >
            <FaShare /> Share Wishlist
          </button>
        </div>
      </div>
      
      <div className={styles.wishlistContainer}>
        <div className={styles.wishlistToolbar}>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={selectedItems.length === wishlistItems.length}
              onChange={handleSelectAll}
            />
            <span>Select All ({wishlistItems.length} items)</span>
          </label>
          <div className={styles.toolbarActions}>
            <button 
              className={styles.addSelectedToCartBtn}
              disabled={selectedItems.length === 0}
              onClick={handleAddSelectedToCart}
            >
              <FaShoppingCart /> Add Selected to Cart
            </button>
          </div>
        </div>
        
        <div className={styles.wishlistItems}>
          {wishlistItems.map(item => (
            <div className={styles.wishlistItem} key={item.id}>
              <div className={styles.itemSelect}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
              </div>
              
              <div className={styles.productInfo}>
                <div className={styles.productImage}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className={styles.placeholderImage}>{item.name.charAt(0)}</div>
                  )}
                </div>
                <div className={styles.productDetails}>
                  <Link to={`/product/${item.id}`} className={styles.productName}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className={styles.productCategory}>{item.category}</p>
                  <div className={styles.productRating}>
                    <div className={styles.stars}>
                      {'★'.repeat(Math.floor(item.rating))}
                      {'☆'.repeat(5 - Math.floor(item.rating))}
                    </div>
                    <span className={styles.reviewCount}>({item.reviews} reviews)</span>
                  </div>
                  {!item.inStock && (
                    <span className={styles.outOfStock}>Out of Stock</span>
                  )}
                </div>
              </div>
              
              <div className={styles.productPricing}>
                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>{item.price}</span>
                  {item.originalPrice && (
                    <span className={styles.originalPrice}>{item.originalPrice}</span>
                  )}
                </div>
                {item.originalPrice && (
                  <span className={styles.discount}>
                    {Math.round((1 - parseFloat(item.price.replace('$', '')) / parseFloat(item.originalPrice.replace('$', ''))) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className={styles.productActions}>
                <button 
                  className={`${styles.addToCartBtn} ${!item.inStock ? styles.disabled : ''}`}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button 
                  className={styles.removeBtn}
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  aria-label="Remove from wishlist"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.wishlistSummary}>
          <div className={styles.wishlistActions}>
            <button 
              className={styles.continueShoppingBtn}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(WishlistPage); 