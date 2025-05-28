import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import './ProductHighlightCard.css';

const ProductHighlightCard = ({ product }) => {
  const { name, category, price, imageUrl, id } = product;
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Ensure consistent text lengths
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleShopNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };
  
  return (
    <div className="product-highlight-card">
      <div 
        className="card-image-container"
        onClick={handleProductClick}
        style={{ cursor: 'pointer' }}
      >
        <img src={imageUrl} alt={name} className="card-image" />
      </div>
      <div className="card-content">
        <div className="card-info">
          <h3 
            className="card-name" 
            onClick={handleProductClick}
          >
            {truncateText(name, 25)}
          </h3>
          <div className="card-category">{truncateText(category, 25)}</div>
          <div className="card-price">{price}</div>
        </div>
        <button className="shop-now-button" onClick={handleShopNow}>SHOP NOW</button>
      </div>
    </div>
  );
};

export default ProductHighlightCard;