import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import './App.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.size === product.size);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevItems, product];
    });
  };

  const updateQuantity = (productId, size, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.size === size))
    );
  };

  const handleCheckout = async () => {
    // Implement checkout logic here
    console.log('Checking out:', cartItems);
  };

  return (
    <Router>
      <div className="app">
        <Navbar 
          cartItems={cartItems}
          onToggleCart={() => setIsCartOpen(!isCartOpen)}
        />
        
        <main className="main-content">
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route 
              path="/products" 
              element={
                <ProductList onAddToCart={addToCart} />
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <ProductDetails onAddToCart={addToCart} />
              } 
            />
            <Route 
              path="/:category" 
              element={
                <ProductList onAddToCart={addToCart} />
              } 
            />
            <Route 
              path="/cart" 
              element={
                <Cart
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onCheckout={handleCheckout}
                />
              } 
            />
          </Routes>
        </main>

        {isCartOpen && (
          <div className="cart-overlay">
            <div className="cart-sidebar">
              <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
              />
              <button 
                className="close-cart"
                onClick={() => setIsCartOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </Router>
  );
};

export default App;
