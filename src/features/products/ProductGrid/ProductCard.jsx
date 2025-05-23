import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import CartNotification from '../../cart/CartNotification';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowNotification(true);
    
    // Hide notification after it animates out
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="product-card">
      {/*<img src={product.imageUrl} alt={product.name} />*/}
      <h3>{product.name}</h3>
      <p>{product.shortDescription}</p>
      <ul>
        <li><strong>Price:</strong> {product.price}</li>
        <li><strong>Category:</strong> {product.category}</li>
      </ul>
      <div className="actions">
        <Link to={`/product/${product.id}`}>
          <button>View Details</button>
        </Link>
        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
      </div>
      
      {showNotification && (
        <CartNotification message={`${product.name} added to cart!`} />
      )}
    </div>
  );
};

export default ProductCard;