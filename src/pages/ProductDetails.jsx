import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Product not found (status: ${response.status})`);
        }

        const data = await response.json();
        console.log('Fetched product data:', data);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    onAddToCart({ ...product, selectedSize });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error">
        <h2>Product Not Found</h2>
        <p>We couldn't find the product you were looking for.</p>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="product-details-image">
        <img
          src={product.image_url}
          alt={product.name}
          onError={(e) => {
            console.error(`Failed to load image: ${product.image_url}`);
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
      </div>
      <div className="product-details-info">
        <h1>{product.name}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description || 'No description available.'}</p>

        <div className="size-selection">
          <label htmlFor="size">Select Size:</label>
          <select
            id="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Choose a size</option>
            {product.sizes
              ? product.sizes.split(',').map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))
              : <option disabled>No sizes available</option>}
          </select>
        </div>

        <div className="stock-info">
          <p>In Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.stock}
        >
          {product.stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
