import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../MainLayout';
import AdminLayout from '../AdminLayout';

const withLayout = (WrappedComponent) => {
  return (props) => {
    const location = useLocation();
    
    // Check if the current route is an admin route
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Choose the appropriate layout
    const Layout = isAdminRoute ? AdminLayout : MainLayout;
    
    return (
      <Layout>
        <WrappedComponent {...props} />
      </Layout>
    );
  };
};

export default withLayout;