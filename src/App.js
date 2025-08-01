// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthProvider from './providers/AuthProvider';
import './styles/global.css';
import AppRouter from './routes/AppRouter';
import TestNotificationButton from './features/notifications/TestNotificationButton';

const App = () => {
  return (
    <>
      <TestNotificationButton />
      <Provider store={store}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Provider>
    </>
  );
};

export default App;