import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="newsletter-section">
        <p>10% OFF YOUR NEXT PURCHASE BY SUBSCRIBING TO THE NEWSLETTER</p>
        <form className="newsletter-form">
          <input type="email" placeholder="E-mail" />
          <button type="submit">Sign up now</button>
        </form>
        <p>
          By subscribing, you confirm that you have read the{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>

      <div className="country-section">
        <p>KENYA</p>
      </div>

      <div className="social-links">
        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="#" target="_blank" rel="noopener noreferrer">TikTok</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Spotify</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Pinterest</a>
        <a href="#" target="_blank" rel="noopener noreferrer">X</a>
        <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <div className="footer-section">
          <Link to="/company">Company</Link>
          <Link to="/work-with-us">Work With Us</Link>
        </div>

      

      <div className="footer-container">
        {/* <div className="footer-section">
          <Link to="/help">Help</Link>
        </div> */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@yourbrand.com</p>
          <p>Phone: +254 700 000 000</p>
          <p>Phone: +254 711 111 111</p>
        </div>
        <div className="footer-section">
          <h3>Shop Location</h3>
          <div className="map-container">
            <iframe
              title="Shop Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.573561206711!2d-0.127647!3d51.507351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b32af5a8f27%3A0x3080327949e5c8e7!2sLondon!5e0!3m2!1sen!2suk!4v1234567890"
              width="100%"
              height="150"
              frameBorder="0"
              allowFullScreen=""
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        {/* <Link to="/privacy-policy-and-cookies">Privacy Policy and Cookies</Link>
        <Link to="/terms-and-conditions">Terms and Conditions</Link>
        <Link to="/ethics-channel">Ethics Channel</Link> */}
        <p>&copy; {new Date().getFullYear()} Your Brand. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
