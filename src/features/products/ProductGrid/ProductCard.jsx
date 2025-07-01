import React, { useCallback, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../../utils/formatCurrency';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../../../api/axiosConfig';
import './ProductCard.css';
import StarRating from '../../../api/Starrating';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Safely get category name
  const getCategoryName = useCallback(() => {
    if (!product?.category) return 'Uncategorized';
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category !== null) {
      return product.category.name || 'Uncategorized';
    }
    return 'Uncategorized';
  }, [product?.category]);

  // Get inventory status
  const getInventoryStatus = useCallback(() => {
    if (!product?.inventoryStatus) return null;
    return {
      isAvailable: product.inventoryStatus.status === 'IN_STOCK',
      quantity: product.inventoryStatus.availableQuantity,
      status: product.inventoryStatus.status,
      price: product.inventoryStatus.price
    };
  }, [product?.inventoryStatus]);

  const handleAddToCart = useCallback(() => {
    const inventoryStatus = getInventoryStatus();
    if (!inventoryStatus?.isAvailable) {
      toast.error('Product is not available for purchase', {
        position: 'bottom-center'
      });
      return;
    }

    const price = inventoryStatus.price;
    if (price == null || isNaN(price)) {
      toast.error('Product price is not available', {
        position: 'bottom-center'
      });
      return;
    }

    const formattedProduct = {
      ...product,
      price: price,
      quantity: 1
    };

    addToCart(formattedProduct);
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center'
    });
  }, [product, addToCart, getInventoryStatus]);

  const handleWishlistToggle = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || '1'; // Default to 1 for testing
      
      if (isInWishlist) {
        await api.delete(`/api/wishlist/${userId}`, {
          data: { productId: product.id }
        });
        toast.success('Removed from wishlist');
      } else {
        const wishlistItem = {
          userId: userId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          imageUrl: product.images?.[0]
        };
        await api.post(`/api/wishlist/${userId}`, wishlistItem);
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

  if (!product) {
    return null;
  }

  const categoryName = getCategoryName();
  const productName = product.name || 'Unnamed Product';
  const productDescription = product.description || 'No description available';
  const productImage = product.images?.[0];
  const inventoryStatus = getInventoryStatus();
  const isAvailable = inventoryStatus?.isAvailable;
  const price = inventoryStatus?.price;
  const formattedPrice = price != null && !isNaN(price) ? formatCurrency(price) : 'Price not available';

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {productImage && (
          <div className="product-image-container">
            <img 
              src={productImage} 
              alt={productName} 
              loading="lazy"
              className="product-image"
            />
            {!isAvailable && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
          </div>
        )}
        <div className="product-info">
          <h3 className="product-name">{productName}</h3>
          <p className="product-description">{productDescription}</p>
          <div className="product-details">
            <span className="product-category">{categoryName}</span>
            <span className={`product-price ${!price ? 'price-not-available' : ''}`}>{formattedPrice}</span>
          </div>
          <ul>
     <li><StarRating rating={product.rating||4} /></li> 
      </ul>
          {isAvailable && inventoryStatus.quantity > 0 && (
            <div className="stock-info">
              {inventoryStatus.quantity} units available
            </div>
          )}
        </div>
      </Link>
      <button 
        className={`add-to-cart-btn ${!isAvailable || !price ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={!isAvailable || !price}
      >
        {!price ? 'Price Not Available' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
      </button>
      <button 
        className="wishlist-btn"
        onClick={handleWishlistToggle}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : isInWishlist ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;