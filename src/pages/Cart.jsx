import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            size: item.selectedSize
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process order');
      }

      onCheckout();
      navigate('/checkout/success');
    } catch (err) {
      setError('Failed to process checkout. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to get started!</p>
        <button 
          className="continue-shopping"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="cart-items">
        {items.map(item => (
          <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
            <img src={item.image_url} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="size">Size: {item.selectedSize}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              
              <div className="quantity-controls">
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.selectedSize, Math.max(0, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <button 
                className="remove-item"
                onClick={() => onRemoveItem(item.id, item.selectedSize)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>

        <button 
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>

        <button 
          className="continue-shopping"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart; 