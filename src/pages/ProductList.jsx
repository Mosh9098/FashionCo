import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ onAddToCart }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'newest',
    color: '',
    size: '',
    price: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        setLoading(true);
        setError(null);

        const response = await fetch('http://127.0.0.1:5000/api/products', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
        setError(`Failed to load products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterProducts = (product) => {
    const { color, size, price } = filters;
    const matchColor = color ? product.color?.toLowerCase() === color : true;
    const matchSize = size ? product.size?.toUpperCase() === size : true;
    const matchPrice = price
      ? (() => {
          const [min, max] = price.split('-').map(Number);
          return product.price >= min && product.price <= max;
        })()
      : true;
    const matchCategory =
      category === 'all' || product.category?.toLowerCase() === category?.toLowerCase();

    return matchColor && matchSize && matchPrice && matchCategory;
  };

  const sortProducts = (a, b) => {
    const { sort } = filters;

    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;

    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB - dateA;
  };

  const displayedProducts = products.filter(filterProducts).sort(sortProducts);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="category-header">
        <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}</h1>
        <p className="product-count">{displayedProducts.length} products</p>
      </div>

      <div className="filters-container">
        <div className="filters">
          {/* Filters */}
          <div className="filter-group">
            <label>Sort by:</label>
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Color:</label>
            <select name="color" value={filters.color} onChange={handleFilterChange}>
              <option value="">All Colors</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Size:</label>
            <select name="size" value={filters.size} onChange={handleFilterChange}>
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Price:</label>
            <select name="price" value={filters.price} onChange={handleFilterChange}>
              <option value="">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-1000">$200+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
