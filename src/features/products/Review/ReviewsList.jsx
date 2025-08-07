import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useReviews } from '../../../hooks/useReviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import Pagination from '../../../components/Pagination/Pagination';
import styles from './ReviewsList.module.css';
import { selectUser, selectIsAuthenticated } from '../../../redux/slices/userSlice';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest' },
  { value: 'createdAt,asc', label: 'Oldest' },
  { value: 'rating,desc', label: 'Highest Rated' },
  { value: 'rating,asc', label: 'Lowest Rated' },
];

const ReviewsList = ({ productId, averageRating, totalReviews, ratingSummary }) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState([SORT_OPTIONS[0].value]);
  const {
    reviews, loading, error, pagination, getReviews, resetReviews,
    createReview, updateReview, deleteReview,
    createLoading, updateLoading, deleteLoading
  } = useReviews();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUserId = user?.id;

  // Fetch reviews when productId, page, or sort changes
  useEffect(() => {
    if (productId) {
      getReviews(productId, page - 1, 5, sort); // 5 reviews per page
    }
    return () => {
      resetReviews();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, page, sort]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort([e.target.value]);
    setPage(1);
  }, []);

  // Handle create review
  const handleCreateReview = async (data) => {
    await createReview({ ...data, productId });
  };

  // Handle update review
  const handleUpdateReview = async (reviewId, data) => {
    await updateReview(reviewId, { ...data, productId });
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId);
  };

  // Calculate total reviews from pagination or reviews length
  const totalReviewsCount = (pagination && typeof pagination.totalItems === 'number') ? pagination.totalItems : (reviews ? reviews.length : 0);

  // Render summary (average, total, breakdown)
  const renderSummary = () => (
    <div className={styles.summary}>
      <div className={styles.averageRatingSection}>
        <span className={styles.averageRating}>{averageRating?.toFixed(1) ?? '0.0'}</span>
        <StarRating rating={averageRating ?? 0} />
        <span className={styles.totalReviews}>{totalReviewsCount} reviews</span>
      </div>
      {ratingSummary && (
        <div className={styles.ratingBreakdown}>
          {[5,4,3,2,1].map(star => (
            <div key={star} className={styles.ratingRow}>
              <span>{star} star</span>
              <div className={styles.ratingBarContainer}>
                <div
                  className={styles.ratingBar}
                  style={{ width: `${(ratingSummary[star] || 0) / (totalReviewsCount || 1) * 100}%` }}
                />
              </div>
              <span className={styles.ratingCount}>{ratingSummary[star] || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render reviews list
  const renderReviews = () => {
    if (loading) return <div className={styles.loading}>Loading reviews...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!reviews || reviews.length === 0) return <div className={styles.noReviews}>No reviews yet.</div>;
    return (
      <ul className={styles.reviewsList}>
        {reviews.map(review => (
          <ReviewItem
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            onEdit={handleUpdateReview}
            onDelete={handleDeleteReview}
            updateLoading={updateLoading}
            deleteLoading={deleteLoading}
          />
        ))}
        <Pagination
            currentPage={pagination.currentPage + 1}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
      </ul>
    );
  };

  return (
    <>
      <section className={styles.reviewsSection} id="reviews">
        <div className={styles.revDiv}>
          <div className={styles.controls}>
            <label htmlFor="sortReviews">Sort by:</label>
            <select id="sortReviews" value={sort[0]} onChange={handleSortChange}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {renderReviews()}
        </div>

        <div className={isAuthenticated ? styles.revDiv : styles.middleAlign}>
          <h2 style={{ textAlign: 'center' }}>Customer Reviews</h2>
          {renderSummary()}
          {/* Show review form if logged in */}
          {isAuthenticated ? (
            <ReviewForm
              mode="create"
              onSubmit={handleCreateReview}
              loading={createLoading}
            />
          ) : <p className={styles.hideReviewForm}>Please log in to leave a review.</p>}
        </div>
      </section>
    </>
  );
};

export default ReviewsList; 