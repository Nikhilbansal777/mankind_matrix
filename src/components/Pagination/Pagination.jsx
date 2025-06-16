import React, { memo, useCallback, useMemo } from 'react';
import styles from './Pagination.module.css';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange]);

  const handlePageClick = useCallback((pageNumber) => {
    onPageChange(pageNumber);
  }, [onPageChange]);

  const pageNumbers = useMemo(() => 
    Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pageButton} ${styles.prevButton}`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Prev
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${styles.pageButton} ${
            currentPage === pageNumber ? styles.activeButton : ''
          }`}
          onClick={() => handlePageClick(pageNumber)}
          aria-label={`Go to page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className={`${styles.pageButton} ${styles.nextButton}`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 