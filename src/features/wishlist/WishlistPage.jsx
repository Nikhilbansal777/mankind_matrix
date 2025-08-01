import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaShare, FaRegHeart } from 'react-icons/fa';
import withLayout from '../../layouts/HOC/withLayout';
import styles from './WishlistPage.module.css';
import { useSelector } from 'react-redux';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  const handleRemoveFromWishlist = (productId) => {
    // TODO: Implement remove from wishlist functionality
    console.log('Remove from wishlist:', productId);
  };

  const handleAddToCart = (product) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product);
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
    // TODO: Implement share functionality
    console.log('Share wishlist');
  };

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