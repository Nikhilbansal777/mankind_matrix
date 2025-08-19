import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from '../features/products/Products.jsx';
import Login from '../features/auth/login.jsx';
import Signup from '../features/auth/signup.jsx';
import Unauthorized from '../features/auth/Unauthorized.jsx';
import ProfilePage from '../features/profile/ProfilePage.jsx';
import AccountPage from '../features/profile/AccountPage.jsx';
import EditProfile from '../features/profile/Edit-Profile.jsx';
import ManageAddressesPage from '../features/profile/ManageAddress.jsx';
import OrderManager from '../features/profile/Orders.jsx';
import PaymentMethods from '../features/profile/Payments.jsx';
import Help from '../features/profile/Help.jsx';
import CartPage from '../features/cart/pages/CartPage.jsx';

import ReturnRequest from '../features/profile/ReturnRequest.jsx';
import AdminPage from '../features/admin/AdminPage.jsx';
import ContactPage from '../features/contact/ContactPage.jsx';
import LandingPages from '../features/landingpage/LandingPages.jsx';  
import ProductView from '../features/products/ProductView/ProductView.jsx';
import AboutUs from '../features/about/AboutUs.jsx';
import CheckoutPage from '../features/cart/pages/CheckoutPage.jsx';
import ConfirmationPage from '../features/cart/pages/ConfirmationPage.jsx';
import LandingPage from '../features/home/LandingPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Blog from '../features/blog/Blog.jsx';
import InvoiceTest from '../features/invoice/InvoiceTest';
import InvoiceGenerator from '../features/invoice/InvoiceGenerator';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Authentication + Admin role required (must come before other routes) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Authentication required */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/addresses" element={<ProtectedRoute><ManageAddressesPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderManager /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
        <Route path="/return-request" element={<ProtectedRoute><ReturnRequest /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        
        {/* Public Routes - No authentication required */}
        <Route path="/products" element={<Product />} />
        <Route path="/invoice-test" element={<InvoiceTest />} />
        <Route path="/invoice" element={<InvoiceGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/oldLadingPage" element={<LandingPage />} />
        <Route path="/blog" element={<Blog />} />
        
        {/* Home route - must be last */}
        <Route path="/" element={<LandingPages />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
