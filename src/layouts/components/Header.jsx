import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import NotificationsUI from '../../features/profile/NotificationsUI';
import WishlistButton from '../../features/wishlist/WishlistButton';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import LogoutButton from '../../features/auth/LogoutButton';

function Header({ onSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated } = useUser();
  
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
     
      {/* Actions section with conditional rendering based on authentication */}
      {/* Actions section with Notifications, Wishlist and Cart */}
      <div className={`header-actions ${isMobile ? 'mobile-transparent' : ''}`}>
        {isAuthenticated ? (
          <>
            {/* Notifications Component - only show when logged in */}
            <NotificationsUI />
           
            {/* Cart icon with item count - only show when logged in */}
            <Link
              to="/cart"
              className={`cart-icon-wrapper ${isMobile ? 'mobile-transparent' : ''}`}
            >
              <FaShoppingCart className="cart-icon" />
              {itemCount > 0 && (
                <span className="cart-count">{itemCount}</span>
              )}
            </Link>

            {/* Logout button - only show when logged in */}
            <LogoutButton 
              className="header-logout-btn"
              children={<FaSignOutAlt />}
              showConfirmation={true}
            />
          </>
        ) : (
          /* Login button - only show when not logged in */
          <Link to="/login" className="header-login-btn">
            <FaSignInAlt />
            <span className="login-text">Login</span>
          </Link>
        )}
        {/* Notifications Component */}
        <NotificationsUI />
        
        {/* Wishlist Button */}
        <WishlistButton />
       
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