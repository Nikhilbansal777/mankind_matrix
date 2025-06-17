import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from '../features/products/Products.jsx';
import Login from '../features/auth/login.jsx';
import Signup from '../features/auth/signup.jsx';
import ProfilePage from '../features/profile/ProfilePage.jsx';
import AccountPage from '../features/profile/AccountPage.jsx';
import EditProfile from '../features/profile/Edit-Profile.jsx';
import ManageAddressesPage from '../features/profile/ManageAddress.jsx';
import OrderManager from '../features/profile/Orders.jsx';
import PaymentMethods from '../features/profile/Payments.jsx';
import Help from '../features/profile/Help.jsx';
import CartPage from '../features/cart/CartPage.jsx';
import CheckoutPage from '../features/cart/CheckoutPage.jsx';
import ReturnRequest from '../features/profile/ReturnRequest.jsx';
import AdminPage from '../features/admin/AdminPage.jsx';
import ContactPage from '../features/contact/ContactPage.jsx';
import LandingPages from '../features/landingpage/LandingPages.jsx';  
import ProductView from '../features/products/ProductView/ProductView.jsx';
import AboutUs from '../features/about/AboutUs.jsx';
import DeliveryPage from '../features/cart/Delivery.jsx';
import LandingPage from '../features/home/LandingPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRouter = () => {
    
  return (
    <Router>
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/" element={<LandingPages />} />
        <Route path="/products" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/oldLadingPage" element={<LandingPage />} />
        
        {/* Protected Routes - Authentication required */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addresses" 
          element={
            <ProtectedRoute>
              <ManageAddressesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderManager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <PaymentMethods />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/return-request" 
          element={
            <ProtectedRoute>
              <ReturnRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delivery" 
          element={
            <ProtectedRoute>
              <DeliveryPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes - Authentication + Admin role required */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy/Redirect Routes */}
        <Route path="AI" element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
