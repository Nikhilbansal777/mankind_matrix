import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-center'
    });
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
    </div>
  );
};

export default ProductCard;