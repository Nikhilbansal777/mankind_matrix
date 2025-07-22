import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';
import ProductManagement from './ProductManagement.jsx';
import UserManagement from './UserManagement.jsx';
import SalesAnalytics from './SalesAnalytics.jsx';
import withLayout from '../../layouts/HOC/withLayout';
import './AdminPage.css';

const AdminPage = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Product Management', component: <ProductManagement /> },
    { id: 'users', label: 'User Management', component: <UserManagement /> },
    { id: 'analytics', label: 'Sales Analytics', component: <SalesAnalytics /> }
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.firstName || 'Admin'}!</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default withLayout(AdminPage);
