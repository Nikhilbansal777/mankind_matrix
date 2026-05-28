import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaChartLine, FaUsers, FaShoppingCart, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import './AdminFooter.css';

function AdminFooter() {
  return (
    <div className="admin-footer">
      <div className="admin-footer-container">
        <div className="admin-footer-column">
          <h4>Management</h4>
          <ul>
            <li><Link to="/admin">Dashboard Overview</Link></li>
            <li><Link to="/admin/users">User Management</Link></li>
            <li><Link to="/admin/products">Product Catalog</Link></li>
            <li><Link to="/admin/orders">Order Processing</Link></li>
          </ul>
        </div>

        <div className="admin-footer-column">
          <h4>Analytics</h4>
          <ul>
            <li><Link to="/admin/analytics">Sales Reports</Link></li>
            <li><Link to="/admin/users">Customer Insights</Link></li>
            <li><Link to="/admin/products">Inventory Tracking</Link></li>
            <li><Link to="/admin/analytics">Performance Metrics</Link></li>
          </ul>
        </div>

        <div className="admin-footer-column">
          <h4>Operations</h4>
          <ul>
            <li><Link to="/admin/orders">Order Fulfillment</Link></li>
            <li><Link to="/admin/users">Customer Support</Link></li>
            <li><Link to="/admin/settings">System Settings</Link></li>
            <li><Link to="/admin/settings">Security & Access</Link></li>
          </ul>
        </div>

        <div className="admin-footer-column">
          <h4>Quick Actions</h4>
          <div className="admin-footer-icons">
            <Link to="/admin/settings" className="admin-footer-icon">
              <FaCog />
              <span>Settings</span>
            </Link>
            <Link to="/admin/analytics" className="admin-footer-icon">
              <FaChartLine />
              <span>Analytics</span>
            </Link>
            <Link to="/admin/users" className="admin-footer-icon">
              <FaUsers />
              <span>Users</span>
            </Link>
            <Link to="/admin/orders" className="admin-footer-icon">
              <FaShoppingCart />
              <span>Orders</span>
            </Link>
            <Link to="/admin/users" className="admin-footer-icon">
              <FaHeadset />
              <span>Support</span>
            </Link>
            <Link to="/admin/settings" className="admin-footer-icon">
              <FaShieldAlt />
              <span>Security</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;
