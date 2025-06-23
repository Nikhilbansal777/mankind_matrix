import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import NotificationsUI from '../../features/profile/NotificationsUI';
import { useCart } from '../../hooks/useCart';

function Header({ onSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { itemCount } = useCart();
 
  // Check if we're on mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
   
    // Initial check
    checkIfMobile();
   
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
   
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
 
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="header">
      {/* Make logo clickable and link to home page */}
      <Link to="/" className="logo-link">
        <div className="logo">Mankind Matrix</div>
      </Link>
      
      {/* Mobile menu toggle button */}
      <div
        className={`mobile-menu-toggle ${isMobile ? 'mobile-transparent' : ''}`}
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      <div className={`header-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <nav className="nav-links">
          <Link to='/products'>Products</Link>
          <a href="#blog">Blog</a>
          <Link to='/about'>About</Link>
          <Link to='/contact'>Contact</Link>
        </nav>
      </div>
     
      {/* Actions section with Notifications and Cart */}
      <div className={`header-actions ${isMobile ? 'mobile-transparent' : ''}`}>
        {/* Notifications Component */}
        <NotificationsUI />
       
        {/* Cart icon with item count */}
        <Link
          to="/cart"
          className={`cart-icon-wrapper ${isMobile ? 'mobile-transparent' : ''}`}
        >
          <FaShoppingCart className="cart-icon" />
          {itemCount > 0 && (
            <span className="cart-count">{itemCount}</span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Header;