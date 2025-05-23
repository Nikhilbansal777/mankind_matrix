// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './styles/global.css';
import AppRouter from './routes/AppRouter';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <Provider store={store}>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </Provider>
  );
};

export default App;