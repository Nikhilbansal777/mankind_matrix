// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthProvider from './providers/AuthProvider';
import './styles/global.css';
import AppRouter from './routes/AppRouter';
import TestNotificationButton from './features/notifications/TestNotificationButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <TestNotificationButton />
      <Provider store={store}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Provider>
      <ToastContainer position="bottom-right" autoClose={4000} />
    </>
  );
};

export default App;