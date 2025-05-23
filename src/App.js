// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './styles/global.css';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;