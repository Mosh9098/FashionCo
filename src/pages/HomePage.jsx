import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      {/* <nav className="navbar">
        <div className="logo">FashionCo</div>
        <div className="nav-links">
          <Link to="/women">Women</Link>
          <Link to="/men">Men</Link>
          <Link to="/children">Children</Link>
          <Link to="/bags">Bags</Link>
        </div>
      </nav> */}

      {/* Hero Video */}
      <div className="hero-section">
        <video className="hero-video" autoPlay loop muted>
          <source src="https://cdn.pixabay.com/video/2023/10/20/185787-876545918_tiny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>FashionCo</h1>
          <p>Explore the latest collections</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="category-grid">
        <Link to="/women" className="category-card">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnEVEouULm_uACCNkkx3shTVJApxKARlZCCUi6Lsct3eoRS6tumrN6oMZxIeSRukJSkHU&usqp=CAU" alt="Women" />
          <span className="category-title">Women</span>
        </Link>
        <Link to="/men" className="category-card">
          <img src="https://cdn.pixabay.com/photo/2023/02/08/06/33/fashion-7775827_640.jpg" alt="Men" />
          <span className="category-title">Men</span>
        </Link>
        <Link to="/children" className="category-card">
          <img src="https://images.pexels.com/photos/28276919/pexels-photo-28276919/free-photo-of-break-the-boundaries.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Children" />
          <span className="category-title">Children</span>
        </Link>
        <Link to="/bags" className="category-card">
          <img src="https://images.pexels.com/photos/22434775/pexels-photo-22434775/free-photo-of-leather-bags-on-white-background.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="Bags" />
          <span className="category-title">Bags</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
