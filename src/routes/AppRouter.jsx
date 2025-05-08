import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../features/home/LandingPage.jsx';
import Product from '../features/products/Products.jsx';
import Login from '../features/auth/login.jsx';
import ProfilePage from '../features/profile/ProfilePage.jsx';
import AccountPage from '../features/profile/accountpage.jsx'; // Importing AccountPage
import EditProfile from '../features/profile/edit-profile.jsx';
import ManageAddressesPage from '../features/profile/manageaddress.jsx';
import OrderManager from '../features/profile/orders.jsx';
import PaymentMethods from '../features/profile/payments.jsx';
import Help from '../features/profile/help.jsx';
import CartPage from '../features/cart/CartPage.jsx';
import ProductPage from '../features/products/ProductPage.jsx';

const AppRouter = () => {
    
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='products' element={<Product></Product>}></Route>
        <Route path='login' element={<Login></Login>}></Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<AccountPage />} /> {/* Added new Account route */}
        <Route path="/addresses" element={<ManageAddressesPage />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payments" element={<PaymentMethods/>} />
        <Route path="/help" element={<Help />} />
        <Route path='cart' element={<CartPage></CartPage>}></Route>
        <Route path='product/:id' element={<ProductPage></ProductPage>}></Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
