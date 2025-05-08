import React, { useState } from 'react';
import './help.css';
import AccountNavigation from './AccountNavigation'; // Import the AccountNavigation component
import styles from './ProfilePage.module.css'; // Import shared styles
import withLayout from '../../layouts/HOC/withLayout';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqCategories = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'payments', name: 'Payments & Billing' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'technical', name: 'Technical Support' }
  ];

  const faqData = {
    general: [
      {
        id: 'general-1',
        question: 'What is [Your Company Name]?',
        answer: '[Your Company Name] is a [brief description of your company/service]. We aim to [company mission/goal].'
      },
      {
        id: 'general-2',
        question: 'How do I contact customer support?',
        answer: 'You can reach our customer support team via email at support@example.com, by phone at (123) 456-7890, or through the contact form on our website. Our support hours are Monday to Friday, 9 AM to 6 PM EST.'
      },
      {
        id: 'general-3',
        question: 'What are your business hours?',
        answer: 'Our online store is available 24/7. Our physical locations are open Monday to Saturday, 10 AM to 8 PM, and Sunday, 12 PM to 6 PM local time. Customer support is available Monday to Friday, 9 AM to 6 PM EST.'
      },
      {
        id: 'general-4',
        question: 'Do you have a loyalty program?',
        answer: 'Yes! Our rewards program offers points for purchases, referrals, and engagement with our brand. These points can be redeemed for discounts, free products, or exclusive experiences. Sign up in your account settings to start earning rewards today.'
      }
    ],
    account: [
      {
        id: 'account-1',
        question: 'How do I create an account?',
        answer: 'To create an account, click the "Sign Up" button in the top right corner of our website. Enter your email address, create a password, and fill in your personal information. Once submitted, you\'ll receive a verification email to confirm your account.'
      },
      {
        id: 'account-2',
        question: 'How do I reset my password?',
        answer: 'If you forgot your password, click on the "Forgot Password" link on the login page. Enter the email address associated with your account, and we\'ll send you instructions to reset your password. For security reasons, password reset links expire after 24 hours.'
      },
      {
        id: 'account-3',
        question: 'How do I update my personal information?',
        answer: 'To update your personal information, log into your account and navigate to the "Profile" section. Here you can edit your name, contact information, address, and other details. Remember to click "Save Changes" when you\'re done.'
      },
      {
        id: 'account-4',
        question: 'Can I have multiple shipping addresses?',
        answer: 'Yes, you can save multiple shipping addresses in your account. Go to "Addresses" in your account settings to add, edit, or remove shipping addresses. You can select which address to use during checkout.'
      }
    ],
    payments: [
      {
        id: 'payments-1',
        question: 'What payment methods do you accept?',
        answer: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. For certain markets, we also offer buy-now-pay-later options like Klarna and Afterpay.'
      },
      {
        id: 'payments-2',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers. Our payment processing is handled by trusted third-party providers with robust security measures.'
      },
      {
        id: 'payments-3',
        question: 'When will I be charged for my order?',
        answer: 'Your payment method will be charged immediately upon completing your purchase. For pre-orders or back-ordered items, you\'ll be charged at the time of order placement, not when the item ships.'
      },
      {
        id: 'payments-4',
        question: 'Do you offer installment payment plans?',
        answer: 'Yes, we partner with several financing providers to offer installment payment options at checkout. Eligibility and terms depend on your location and credit history. Available options will be displayed during the checkout process.'
      }
    ],
    orders: [
      {
        id: 'orders-1',
        question: 'How do I track my order?',
        answer: 'You can track your order by logging into your account and navigating to "Order History." Click on the specific order to view its current status and tracking information. You\'ll also receive email updates with tracking details once your order ships.'
      },
      {
        id: 'orders-2',
        question: 'How long will shipping take?',
        answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options (1-2 business days) are available at checkout for an additional fee. International shipping times vary by destination, generally 7-14 business days.'
      },
      {
        id: 'orders-3',
        question: 'Can I change or cancel my order?',
        answer: 'Orders can be modified or canceled within 1 hour of placement. After that window, our system begins processing your order for fulfillment. If you need to make changes after this period, please contact customer support immediately, though we cannot guarantee changes can be accommodated once processing has begun.'
      },
      {
        id: 'orders-4',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to over 40 countries worldwide. International shipping rates and delivery times vary by destination. Please note that customers are responsible for any import duties, taxes, or customs fees that may apply when receiving international shipments.'
      }
    ],
    returns: [
      {
        id: 'returns-1',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items in new, unused condition with original packaging and tags. Some products have specific return restrictions, which are noted on their product pages. Returns initiated after 30 days may be eligible for store credit at our discretion.'
      },
      {
        id: 'returns-2',
        question: 'How do I initiate a return?',
        answer: 'To start a return, log into your account, go to "Order History," select the order containing the item(s) you wish to return, and click "Return Items." Follow the instructions to generate a return shipping label and receive return authorization. Please do not send returns without completing this process first.'
      },
      {
        id: 'returns-3',
        question: 'When will I receive my refund?',
        answer: 'Once your return is received and inspected (usually within 3-5 business days), we\'ll process your refund. The funds will appear back in your original payment method within 7-10 business days, depending on your financial institution\'s processing times.'
      },
      {
        id: 'returns-4',
        question: 'Do I have to pay for return shipping?',
        answer: 'For defective items or shipping errors, return shipping is free. For preference-based returns (size, color, etc.), return shipping costs are the customer\'s responsibility unless otherwise noted in a promotion or loyalty program benefit.'
      }
    ],
    technical: [
      {
        id: 'technical-1',
        question: 'Why isn\'t the website loading properly?',
        answer: 'If you\'re experiencing loading issues, try clearing your browser cache and cookies, ensure your browser is updated to the latest version, or try a different browser. If problems persist, check your internet connection or contact our technical support team for assistance.'
      },
      {
        id: 'technical-2',
        question: 'The item I want shows as out of stock. When will it be available?',
        answer: 'For out-of-stock items, you can click "Notify Me" on the product page to receive an email when the item is restocked. While we can\'t guarantee specific restock dates, most popular items are replenished within 2-4 weeks.'
      },
      {
        id: 'technical-3',
        question: 'I can\'t log into my account. What should I do?',
        answer: 'If you\'re having trouble logging in, first try resetting your password. If that doesn\'t work, ensure you\'re using the correct email address, check for any typos, and make sure your caps lock is off. If problems persist, contact our support team who can investigate account access issues.'
      },
      {
        id: 'technical-4',
        question: 'Is your website compatible with mobile devices?',
        answer: 'Yes, our website is fully responsive and optimized for all devices, including smartphones and tablets. We support all major browsers (Chrome, Safari, Firefox, Edge) on both iOS and Android operating systems. If you encounter display issues on a specific device, please let us know.'
      }
    ]
  };

  const filteredFAQs = searchQuery
    ? Object.values(faqData).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory];

  return (
    <div className="help-outer-container">
      <AccountNavigation />
      
      <div className="help-outer-content">
        <div className="help-container">
          <div className="help-header">
            <h1>Help & FAQ</h1>
            <p>Find answers to commonly asked questions and get support for your inquiries.</p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="help-content">
            <aside className="help-sidebar">
              <h3>Categories</h3>
              <ul className="category-list">
                {faqCategories.map(category => (
                  <li 
                    key={category.id}
                    className={activeCategory === category.id && !searchQuery ? 'active' : ''}
                  >
                    <button onClick={() => {
                      setActiveCategory(category.id);
                      setSearchQuery('');
                    }}>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="contact-info">
                <h3>Need more help?</h3>
                <p>Our support team is here for you</p>
                <button className="contact-button">Contact Support</button>
              </div>
            </aside>

            <div className="faq-content">
              {searchQuery ? (
                <>
                  <h2>Search Results: {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} for "{searchQuery}"</h2>
                  {filteredFAQs.length === 0 && (
                    <div className="no-results">
                      <p>No results found. Please try a different search term or browse by category.</p>
                    </div>
                  )}
                </>
              ) : (
                <h2>{faqCategories.find(cat => cat.id === activeCategory)?.name}</h2>
              )}

              <div className="faq-list">
                {filteredFAQs.map(item => (
                  <div className="faq-item" key={item.id}>
                    <button 
                      className={`faq-question ${expandedQuestions[item.id] ? 'expanded' : ''}`} 
                      onClick={() => toggleQuestion(item.id)}
                      aria-expanded={expandedQuestions[item.id]}
                    >
                      {item.question}
                      <span className="faq-icon">{expandedQuestions[item.id] ? '−' : '+'}</span>
                    </button>
                    {expandedQuestions[item.id] && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="help-footer">
            <div className="help-resources">
              <div className="resource-card">
                <h3>User Guides</h3>
                <p>Detailed instructions on how to use our platform and services</p>
                <a href="#guides" className="resource-link">View Guides</a>
              </div>
              <div className="resource-card">
                <h3>Video Tutorials</h3>
                <p>Watch step-by-step tutorials to get the most out of our services</p>
                <a href="#tutorials" className="resource-link">Watch Now</a>
              </div>
              <div className="resource-card">
                <h3>Community Forum</h3>
                <p>Connect with other users to share tips and get advice</p>
                <a href="#forum" className="resource-link">Join Discussion</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Help);