import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import withLayout from '../../layouts/HOC/withLayout';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <FaLock />
        </div>
        
        <h1 className="unauthorized-title">Access Denied</h1>
        
        <p className="unauthorized-message">
          Sorry, you don't have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        

        
        <div className="unauthorized-help">
          <p>
            Need help? <Link to="/contact">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Unauthorized); 