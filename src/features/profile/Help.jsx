import React, { useState } from 'react';
import './Help.css';
import AccountNavigation from './AccountNavigation';
import withLayout from '../../layouts/HOC/withLayout';
import { faqCategories, faqData, helpResources, contactMethods } from './HelpData';

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

  const filteredFAQs = searchQuery
    ? Object.values(faqData).flat().filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory];

  return (
    <div className="help-page-container">
      <AccountNavigation />
      
      <div className="help-main-content">
        <div className="help-content-wrapper">
          <header className="help-page-header">
            <h1 className="help-page-title">Help & FAQ</h1>
            <p className="help-page-description">Find answers to commonly asked questions and get support for your inquiries.</p>
            <div className="help-search-container">
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="help-search-input"
              />
              {searchQuery && (
                <button 
                  className="help-search-clear-button" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </header>

          <div className="help-page-layout">
            <aside className="help-category-sidebar">
              <h3 className="sidebar-heading">Categories</h3>
              <ul className="category-list">
                {faqCategories.map(category => (
                  <li 
                    key={category.id}
                    className={`category-list-item ${activeCategory === category.id && !searchQuery ? 'category-active' : ''}`}
                  >
                    <button 
                      className="category-select-button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearchQuery('');
                      }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="help-contact-section">
                <h3 className="sidebar-heading">Need more help?</h3>
                <p className="contact-description">Our support team is here for you</p>
                <button className="contact-support-button">{contactMethods.buttonText}</button>
              </div>
            </aside>

            <main className="faq-content-area">
              {searchQuery ? (
                <>
                  <h2 className="content-section-heading">
                    Search Results: {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </h2>
                  {filteredFAQs.length === 0 && (
                    <div className="search-no-results">
                      <p className="no-results-message">No results found. Please try a different search term or browse by category.</p>
                    </div>
                  )}
                </>
              ) : (
                <h2 className="content-section-heading">
                  {faqCategories.find(cat => cat.id === activeCategory)?.name}
                </h2>
              )}

              <div className="faq-items-container">
                {filteredFAQs.map(item => (
                  <div className="faq-item" key={item.id}>
                    <button 
                      className={`faq-question-toggle ${expandedQuestions[item.id] ? 'question-expanded' : ''}`} 
                      onClick={() => toggleQuestion(item.id)}
                      aria-expanded={expandedQuestions[item.id]}
                    >
                      <span className="question-text">{item.question}</span>
                      <span className="toggle-indicator">{expandedQuestions[item.id] ? '−' : '+'}</span>
                    </button>
                    {expandedQuestions[item.id] && (
                      <div className="faq-answer-wrapper">
                        <p className="answer-text">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </main>
          </div>

          <footer className="help-page-footer">
            <div className="resource-cards-grid">
              {helpResources.map((resource, index) => (
                <div className="resource-card" key={index}>
                  <h3 className="resource-card-title">{resource.title}</h3>
                  <p className="resource-card-description">{resource.description}</p>
                  <a href={resource.link} className="resource-card-link">{resource.linkText}</a>
                </div>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default withLayout(Help);