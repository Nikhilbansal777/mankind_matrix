import React, { useEffect, useState } from 'react';
import reviewService from '../../../api2/services/reviewService';
import userService from '../../../api2/services/userService';
import StarRating from '../../../api/Starrating';
import ProductAverageRating from './ProductAverageRating';


// Clickable star input component
const StarInput = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 2, fontSize: 24, cursor: 'pointer' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => onChange(star)}
        style={{ color: star <= value ? '#f5a623' : '#ccc', transition: 'color 0.2s' }}
        data-testid={`star-input-${star}`}
      >
        ★
      </span>
    ))}
  </div>
);

const getInitials = (name) => {
  if (!name) return 'A';
  return name[0].toUpperCase();
};

// Format date as 'MMM DD, YYYY'
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const ProductReviews = ({ productId, reviews = [], setReviews, average }) => {
  const [userNames, setUserNames] = useState({});
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user names for all unique userIds
  useEffect(() => {
    const uniqueUserIds = [...new Set(reviews.map(r => r && r.userId).filter(Boolean))];
    Promise.all(uniqueUserIds.map(id =>
      userService.getUser(id)
        .then(res => [id, res.data && res.data.firstName ? res.data.firstName : 'Anonymous'])
        .catch(() => [id, 'Anonymous'])
    )).then(pairs => setUserNames(Object.fromEntries(pairs)));
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const newReview = await reviewService.submitReview({
        userId: 1, // Replace with real user
        productId,
        rating: Number(rating),
        comment: comment.trim(),
      });
      setReviews([...reviews, newReview]);
      setComment('');
      setRating(0);
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-reviews-section" style={{ marginTop: 32, padding: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        {/* Average rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h3 style={{ color: '#1976d2', margin: 0 }}>Product Reviews</h3>
          {average && <ProductAverageRating average={average} count={reviews.length} />}
        </div>
        {/* Review cards */}
        <div className="review-cards" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((r) => (
            <div
              key={r.id}
              className="review-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                background: '#fff',
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: 16,
                flexWrap: 'wrap',
              }}
            >
              <div
                className="review-avatar"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#1976d2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 20,
                  flexShrink: 0,
                  userSelect: 'none',
                }}
                title={userNames[r.userId] || 'Anonymous'}
              >
                {getInitials(userNames[r.userId] || 'Anonymous')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{userNames[r.userId] || 'Anonymous'}</span>
                  <StarRating rating={r.rating} />
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>{formatDate(r.createdAt)}</span>
                </div>
                <div style={{ color: '#444', marginTop: 4, fontSize: 15 }}>{r.comment}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Review form */}
        <form
          onSubmit={handleSubmit}
          className="review-form"
          style={{
            background: '#f9f9f9',
            borderRadius: 10,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 12,
          }}
        >
          <div style={{ fontWeight: 500, color: '#333', fontSize: 16 }}>Leave a Review</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500 }}>Your Rating:</span>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Write your review..."
            style={{
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: 10,
              fontSize: 15,
              resize: 'vertical',
              width: '100%',
              minHeight: 60,
            }}
          />
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            style={{
              alignSelf: 'flex-start',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 16,
              cursor: submitting || !comment.trim() ? 'not-allowed' : 'pointer',
              opacity: submitting || !comment.trim() ? 0.7 : 1,
              marginTop: 4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .product-reviews-section > div { max-width: 98vw !important; padding: 0 2vw; }
          .review-card { flex-direction: column !important; align-items: flex-start !important; }
          .review-avatar { margin-bottom: 8px; }
        }
      `}</style>
    </div>
  );
};

export default ProductReviews; 