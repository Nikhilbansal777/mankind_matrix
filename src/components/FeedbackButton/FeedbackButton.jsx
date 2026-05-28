import React, { useState } from 'react';
import { FaComment, FaTimes, FaStar } from 'react-icons/fa';
import './FeedbackButton.css';

const FeedbackButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setRating(0);
    setFeedback('');
    setIsSubmitted(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { rating, feedback });
    setIsSubmitted(true);
    
    // Close modal after 2 seconds
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
    }, 2000);
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button 
        className="feedback-button"
        onClick={handleOpenModal}
        aria-label="Provide feedback"
      >
        <FaComment />
        <span className="feedback-text">Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="feedback-modal-overlay" onClick={handleCloseModal}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <FaTimes />
            </button>

            {!isSubmitted ? (
              <div className="feedback-content">
                <h3>We'd love to hear from you!</h3>
                <p>How would you rate your experience with our website?</p>
                
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn ${star <= rating ? 'active' : ''}`}
                      onClick={() => handleStarClick(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="feedback-input-group">
                    <label htmlFor="feedback-text">Tell us more (optional):</label>
                    <textarea
                      id="feedback-text"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or report any issues..."
                      rows="4"
                    />
                  </div>

                  <div className="feedback-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={rating === 0}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="feedback-success">
                <div className="success-icon">✓</div>
                <h3>Thank you for your feedback!</h3>
                <p>We appreciate you taking the time to help us improve.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton; 