import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../features/home/LandingPage.jsx';
import Product from '../features/products/Products.jsx';
import Login from '../features/auth/login.jsx';
import ProfilePage from '../features/profile/ProfilePage.jsx';
import AccountPage from '../features/profile/AccountPage.jsx'; // Importing AccountPage
import EditProfile from '../features/profile/Edit-Profile.jsx';
import ManageAddressesPage from '../features/profile/ManageAddress.jsx';
import OrderManager from '../features/profile/Orders.jsx';
import PaymentMethods from '../features/profile/Payments.jsx';
import Help from '../features/profile/Help.jsx';
import CartPage from '../features/cart/CartPage.jsx';
import ProductView from '../features/products/ProductView/ProductView.jsx';
import ProductPage from '../features/products/Products.jsx';
import ReturnRequest from '../features/profile/ReturnRequest.jsx';
import AdminPage from '../features/admin/AdminPage.jsx';
const AppRouter = () => {
    
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='products' element={<Product></Product>}></Route>
        <Route path='login' element={<Login></Login>}></Route>
        <Route path='admin' element={<AdminPage></AdminPage>}></Route>
        <Route path='return-request' element={<ReturnRequest></ReturnRequest>}></Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<AccountPage />} /> {/* Added new Account route */}
        <Route path="/addresses" element={<ManageAddressesPage />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payments" element={<PaymentMethods/>} />
        <Route path="/help" element={<Help />} />
        <Route path='cart' element={<CartPage></CartPage>}></Route>
        <Route path="AI" element={<CartPage></CartPage>}></Route>
        <Route path='product/:id' element={<ProductPage></ProductPage>}></Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
