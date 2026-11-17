import React from 'react';
import { useNavigate } from 'react-router-dom';
import withLayout from '../../../layouts/HOC/withLayout';
import { useSelector } from 'react-redux';
import { selectCompareItems } from '../../../redux/slices/compareSlice';
import InlineCompare from './InlineCompare';
import './ComparePage.css';

const ComparePage = () => {
  const navigate = useNavigate();
  const items = useSelector(selectCompareItems);

  const goBack = () => navigate('/products');

  return (
    <div className="compare-page">
      <div className="compare-page-header">
        <button className="back-button" onClick={goBack}>← Back to Products</button>
      </div>

      {(!items || items.length < 2) ? (
        <div className="compare-empty">
          <p>Select at least two products to compare.</p>
          <button className="back-button primary" onClick={goBack}>Browse Products</button>
        </div>
      ) : (
        <div className="compare-content">
          <InlineCompare />
        </div>
      )}
    </div>
  );
};

export default withLayout(ComparePage);

