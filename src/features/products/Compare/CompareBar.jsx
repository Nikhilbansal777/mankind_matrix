import React, { memo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCompareItems, removeFromCompare, clearCompare } from '../../../redux/slices/compareSlice';
import './CompareBar.css';
// Removed modal view in favor of dedicated page

const CompareBar = memo(() => {
	const items = useSelector(selectCompareItems);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const goToInlineCompare = () => {
		if (items.length >= 2) {
			navigate('/compare');
		}
	};

	if (!items || items.length === 0) return null;

	return (
		<div className="compare-bar">
			<div className="compare-items">
				{items.map(item => (
					<div key={item.id} className="compare-item">
						{item.image ? (
							<img src={item.image} alt={item.name} />
						) : (
							<div className="placeholder" />
						)}
						<span className="name" title={item.name}>{item.name}</span>
						<button className="remove" onClick={() => dispatch(removeFromCompare(item.id))}>×</button>
					</div>
				))}
			</div>
			<div className="compare-actions">
				<button className="clear" onClick={() => dispatch(clearCompare())}>Clear</button>
				<button className="go" onClick={goToInlineCompare} disabled={items.length < 2}>Compare ({items.length})</button>
			</div>
		</div>
	);
});

CompareBar.displayName = 'CompareBar';

export default CompareBar;

