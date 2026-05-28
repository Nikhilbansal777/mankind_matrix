import React, { useState } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import styles from './ReviewsList.module.css';

const EditIcon = () => (
  <button className={styles.iconBtn} title="Edit Review" aria-label="Edit Review">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-9.6 9.6-2.3.7.7-2.3 9.6-9.6zM3 17h14v2H3v-2z" fill="#888"/></svg>
  </button>
);
const DeleteIcon = () => (
  <button className={styles.iconBtn} title="Delete Review" aria-label="Delete Review">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 7v7m4-7v7m4-7v7M4 5h12l-1 12.5A2 2 0 0 1 13 19H7a2 2 0 0 1-2-1.5L4 5zm3-2h6a1 1 0 0 1 1 1v1H6V4a1 1 0 0 1 1-1z" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
);

const ReviewItem = ({ review, currentUserId, onEdit, onDelete, updateLoading, deleteLoading }) => {
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = currentUserId && review.userId === currentUserId;

  const handleEdit = () => setEditMode(true);
  const handleCancelEdit = () => setEditMode(false);
  const handleEditSubmit = async (data) => {
    await onEdit(review.id, data);
    setEditMode(false);
  };
  const handleDelete = () => setShowConfirm(true);
  const handleConfirmDelete = async () => {
    await onDelete(review.id);
    setShowConfirm(false);
  };
  const handleCancelDelete = () => setShowConfirm(false);

  if (editMode) {
    return (
      <li className={styles.reviewItem}>
        <ReviewForm
          mode="edit"
          initialRating={review.rating}
          initialComment={review.comment}
          onSubmit={handleEditSubmit}
          loading={updateLoading}
          onCancel={handleCancelEdit}
        />
      </li>
    );
  }

  return (
    <li className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <span className={styles.username}>{review.username || 'Hidden user'}</span>
        <StarRating rating={review.rating} />
        <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
        {isOwner && !deleteLoading && (
          <span>
            <span onClick={handleEdit}><EditIcon /></span>
            <span onClick={handleDelete}><DeleteIcon /></span>
          </span>
        )}
      </div>
      <div className={styles.comment}>{review.comment}</div>
      {isOwner && showConfirm && (
        <div className={styles.confirmDialog}>
          <div>Are you sure you want to delete this review?</div>
          <div className={styles.confirmDialogActions}>
            <button className={styles.cancelBtn} onClick={handleCancelDelete} disabled={deleteLoading}>Cancel</button>
            <button className={styles.submitBtn} onClick={handleConfirmDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ReviewItem; 