import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import './ProductHighlightCard.css';
import { Link } from 'react-router-dom';

const ProductHighlightCard = ({ product }) => {
  const { name, category, price, imageUrl, id, shortDescription } = product;
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
          <p className="card-description">
            {truncateText(shortDescription, 100)}
          </p>
          <div className="product-details">
            <span className="price">{price}</span>
            <span className="category">{truncateText(category, 25)}</span>
          </div>
        </div>
        <Link to={`/product/${id}`} className="learn-more">
          Learn more &gt;
        </Link>
      </div>
    </div>
  );
};

export default ProductHighlightCard;