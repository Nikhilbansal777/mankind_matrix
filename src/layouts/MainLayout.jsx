import React from 'react';
import './MainLayout.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CompareBar from '../features/products/Compare/CompareBar';
import FeedbackButton from '../components/FeedbackButton';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
        <main className="main-content-wrapper">
          {children}
        </main>
      <Footer />
      <CompareBar />
      <FeedbackButton />
    </div>
  );
};

export default MainLayout;
