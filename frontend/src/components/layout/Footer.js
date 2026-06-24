import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <div className="brand-logo">🏠 <span>Rent<b>Nest</b></span></div>
        <p>Affordable furniture & appliance rentals for students, professionals, and urban movers. Live comfortably, move freely.</p>
        <div className="social-links">
          {['twitter','instagram','facebook','linkedin'].map(s => (
            <a key={s} href="#!" className="social-link" aria-label={s}>
              {s === 'twitter' && '🐦'}
              {s === 'instagram' && '📸'}
              {s === 'facebook' && '👍'}
              {s === 'linkedin' && '💼'}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-col">
        <h4>Products</h4>
        <ul>
          <li><Link to="/products?category=Furniture">Furniture</Link></li>
          <li><Link to="/products?category=Appliances">Appliances</Link></li>
          <li><Link to="/products?category=Electronics">Electronics</Link></li>
          <li><Link to="/products">View All</Link></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#!">About Us</a></li>
          <li><a href="#!">How It Works</a></li>
          <li><a href="#!">Blog</a></li>
          <li><a href="#!">Careers</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="#!">FAQ</a></li>
          <li><a href="#!">Contact Us</a></li>
          <li><a href="#!">Terms of Service</a></li>
          <li><a href="#!">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} RentNest. All rights reserved. Built with ❤️ for urban living.</p>
    </div>
  </footer>
);

export default Footer;
