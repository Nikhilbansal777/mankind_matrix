import React, { memo, useCallback, useMemo } from 'react';

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
    <div className="pagination flex justify-center mt-4 gap-2">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Prev
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`px-3 py-1 rounded ${
            currentPage === pageNumber 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
          onClick={() => handlePageClick(pageNumber)}
          aria-label={`Go to page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
