import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Product from "../features/products/Products.jsx";
import Login from "../features/auth/login.jsx";
import Signup from "../features/auth/signup.jsx";
import Unauthorized from "../features/auth/Unauthorized.jsx";

import ProfilePage from "../features/profile/ProfilePage.jsx";
import AccountPage from "../features/profile/AccountPage.jsx";
import EditProfile from "../features/profile/Edit-Profile.jsx";
import ManageAddressesPage from "../features/profile/ManageAddress.jsx";
import OrderManager from "../features/profile/Orders.jsx";
import PaymentMethods from "../features/profile/Payments.jsx";
import Help from "../features/profile/Help.jsx";
import ReturnRequest from "../features/profile/ReturnRequest.jsx";

import CartPage from "../features/cart/pages/CartPage.jsx";
import CheckoutPage from "../features/cart/pages/CheckoutPage.jsx";
import ConfirmationPage from "../features/cart/pages/ConfirmationPage.jsx";

import AdminPage from "../features/admin/AdminPage.jsx";
import AuditLogsPage from "../features/admin/pages/auditlogs/AuditLogsPage.jsx";
import ProductsPage from "../features/admin/pages/products/ProductsPage.jsx";
import UsersPage from "../features/admin/pages/users/UsersPage.jsx";
import UserAddressesPage from "../features/admin/pages/users/UserAddressesPage.jsx";

import ContactPage from "../features/contact/ContactPage.jsx";
import LandingPages from "../features/landingpage/LandingPages.jsx";
import ProductView from "../features/products/ProductView/ProductView.jsx";
import AboutUs from "../features/about/AboutUs.jsx";
import PrivacyPolicy from "../features/privacy/PrivacyPolicy.jsx";
import TermsAndConditions from "../features/terms/TermsAndConditions.jsx";
import LandingPage from "../features/home/LandingPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Blog from "../features/blog/Blog.jsx";
import ComparePage from "../features/products/Compare/ComparePage.jsx";

// import InvoiceGenerator from '../features/profile/InvoiceGenerator.jsx';
// import InvoiceTest from '../features/invoice/InvoiceTest.jsx';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* =========================================================
            ADMIN ROUTES
            ========================================================= */}

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Products */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Users */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin User Addresses */}
        <Route
          path="/admin/users/:id/addresses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserAddressesPage />
            </ProtectedRoute>
          }
        />

        {/* =========================================================
            AUDIT LOGS
            TEMPORARILY PUBLIC FOR FRONTEND TESTING
            ========================================================= */}

        <Route path="/admin/audit-logs" element={<AuditLogsPage />} />

        {/* =========================================================
            PROTECTED USER ROUTES
            ========================================================= */}

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
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
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
          path="/confirmation"
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* =========================================================
            PUBLIC ROUTES
            ========================================================= */}

        <Route path="/products" element={<Product />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/about" element={<AboutUs />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/terms" element={<TermsAndConditions />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/product/:id" element={<ProductView />} />

        <Route path="/compare" element={<ComparePage />} />

        <Route path="/oldLadingPage" element={<LandingPage />} />

        <Route path="/blog" element={<Blog />} />

        {/* =========================================================
            HOME
            ========================================================= */}

        <Route path="/" element={<LandingPages />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
