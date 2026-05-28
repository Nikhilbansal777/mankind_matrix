import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li>About Mankind Matrix</li>
            <li>Our Vision</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Technologies</h4>
          <ul>
            <li>AI & Deep Learning</li>
            <li>Semiconductors</li>
            <li>Cloud Integration</li>
            <li>APIs & Dev Tools</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Products</h4>
          <ul>
            <li>GPUs & AI Hardware</li>
            <li>AI Software Platforms</li>
            <li>Edge & Data Center Solutions</li>
            <li>Consumer Electronics</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
