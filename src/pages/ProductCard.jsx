import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  console.log('Rendering ProductCard with product:', product);

  if (!product) {
    console.error('Error: Received null or undefined product object.');
    return <div className="error-message">Product data is unavailable.</div>;
  }

  // Ensure the necessary fields are available
  const { id, name, price, image_url } = product;
  if (!id || !name || !price) {
    console.error('Error: Product is missing required fields:', product);
    return <div className="error-message">Incomplete product details.</div>;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      console.warn('Warning: onAddToCart function is not provided.');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-link">
        <div className="product-image">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              onError={(e) => {
                console.warn(`Failed to load product image: ${image_url}`);
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
        <div className="product-info">
          <h3>{name}</h3>
          <p className="price">${price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
