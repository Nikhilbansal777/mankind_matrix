import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-toastify';
import './ProductHighlightCard.css';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';

const ProductHighlightCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Ensure consistent text lengths
  const truncateText = useCallback((text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

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

  const handleShopNow = useCallback(() => {
    if (!product) return;
    const status = getInventoryStatus();
    if (!status?.isAvailable || !status?.price) {
      toast.error('Product is not available for purchase', {
        position: 'bottom-center'
      });
      return;
    }
    addToCart({
      ...product,
      price: product.inventoryStatus?.price,
      quantity: 1
    });
    navigate('/cart');
  }, [addToCart, navigate, product, getInventoryStatus]);

  const handleProductClick = useCallback(() => {
    if (!product?.id) return;
    navigate(`/product/${product.id}`);
  }, [navigate, product?.id]);

  // Safely get category name
  const getCategoryName = useCallback(() => {
    if (!product?.category) return 'Uncategorized';
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category !== null) {
      return product.category.name || 'Uncategorized';
    }
    return 'Uncategorized';
  }, [product?.category]);
  
  if (!product) {
    return null;
  }

  const { name, category, description, images, id, inventoryStatus } = product;
  const inventory = getInventoryStatus();
  const isAvailable = inventory?.isAvailable;
  const hasPrice = Boolean(inventory?.price);
  
  return (
    <div className="product-highlight-card">
      <div 
        className="card-image-container"
        onClick={handleProductClick}
        style={{ cursor: 'pointer' }}
      >
        <img src={images?.[0]} alt={name || 'Product image'} className="card-image" />
        {!isAvailable && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      <div className="card-content">
        <div className="card-info">
          <h3 
            className="card-name" 
            onClick={handleProductClick}
          >
            {truncateText(name || '', 25)}
          </h3>
          <p className="card-description">
            {truncateText(description || '', 100)}
          </p>
          <div className="product-details">
            <span className="category">{getCategoryName()}</span>
            {inventory?.quantity > 0 && (
              <span className="stock-info">In Stock: {inventory.quantity}</span>
            )}
            {hasPrice && (
              <span className="price">{formatCurrency(inventory.price)}</span>
            )}
          </div>
        </div>
        <div className="card-actions">
          <Link to={`/product/${id}`} className="learn-more">
            Learn more &gt;
          </Link>
          {hasPrice && (
            <button 
              onClick={handleShopNow}
              disabled={!isAvailable}
              className={`shop-now-btn ${!isAvailable ? 'disabled' : ''}`}
            >
              {isAvailable ? 'Shop Now' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductHighlightCard.displayName = 'ProductHighlightCard';

export default ProductHighlightCard;