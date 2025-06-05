import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from '../features/products/Products.jsx';
import Login from '../features/auth/login.jsx';
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
import WishlistPage from '../features/wishlist/WishlistPage.jsx';

const AppRouter = () => {
    
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path='products' element={<Product></Product>}></Route>
        <Route path='login' element={<Login></Login>}></Route>
        <Route path='admin' element={<AdminPage></AdminPage>}></Route>
        <Route path='return-request' element={<ReturnRequest></ReturnRequest>}></Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/addresses" element={<ManageAddressesPage />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payments" element={<PaymentMethods/>} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path='delivery' element={<DeliveryPage></DeliveryPage>}></Route>
        <Route path='cart' element={<CartPage></CartPage>}></Route>
        <Route path='checkout' element={<CheckoutPage></CheckoutPage>}></Route>
        <Route path="AI" element={<CartPage></CartPage>}></Route>
        <Route path='product/:id' element={<ProductView></ProductView>}></Route>
        <Route path='contact' element={<ContactPage>/</ContactPage>}></Route>
        <Route path='wishlist' element={<WishlistPage></WishlistPage>}></Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
