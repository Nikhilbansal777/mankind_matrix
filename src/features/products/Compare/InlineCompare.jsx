import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCompareItems } from '../../../redux/slices/compareSlice';
import './InlineCompare.css';

const InlineCompare = () => {
	const items = useSelector(selectCompareItems);

	const allSpecKeys = useMemo(() => {
		const keys = new Set();
		(items || []).forEach(item => {
			const specs = item.specifications || {};
			Object.keys(specs).forEach(k => keys.add(k));
		});
		return Array.from(keys);
	}, [items]);

	if (!items || items.length < 2) return null;

	return (
		<div className="inline-compare">
			<h2>Compare Products</h2>
			<div className="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Specification</th>
							{items.map(item => (
								<th key={item.id}>
									<div className="header">
										{item.image ? <img src={item.image} alt={item.name} /> : <div className="ph" />}
										<span>{item.name}</span>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{allSpecKeys.length === 0 ? (
							<tr><td colSpan={1 + items.length}>No specifications available.</td></tr>
						) : (
							allSpecKeys.map(key => (
								<tr key={key}>
									<td className="k">{key}</td>
									{items.map(item => (
										<td key={item.id + '-' + key}>{(item.specifications || {})[key] ?? '-'}</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default InlineCompare;

