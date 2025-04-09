import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartItems, onToggleCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">FashionCo</Link>
        </div>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {/* <Link to="/about">About</Link> */}
          {/* <Link to="/contact">Contact</Link> */}
        </div>

        <div className="nav-actions">
          <button className="cart-toggle" onClick={onToggleCart}>
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;