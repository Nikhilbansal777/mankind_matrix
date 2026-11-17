import React, { useState, useEffect, useRef } from 'react';
import StarRating from './StarRating';
import styles from './ReviewsList.module.css';

const ReviewForm = ({
  mode = 'create',
  initialRating = 0,
  initialComment = '',
  onSubmit,
  loading = false,
  error = null,
  onCancel
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const prevLoading = useRef(loading);

  useEffect(() => {
    // Reset form after successful submit in create mode
    if (
      mode === 'create' &&
      prevLoading.current && !loading
    ) {
      setRating(0);
      setComment('');
    }
    prevLoading.current = loading;
  }, [loading, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5 || !comment.trim()) return;
    onSubmit({ rating, comment });
  };

  return (
    <form className={styles.reviewForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Rating:</label>
        <StarRating editable value={rating} onChange={setRating} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="review-comment">Comment:</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={10}
          className={styles.textarea}
          maxLength={500}
          required
        />
      </div>
      {error && <div className={styles.formError}>{error}</div>}
      <div className={styles.formActions}>
        {mode === 'edit' && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading || rating < 1 || !comment.trim()}>
          {loading ? (mode === 'edit' ? 'Updating...' : 'Submitting...') : (mode === 'edit' ? 'Update Review' : 'Submit Review')}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 