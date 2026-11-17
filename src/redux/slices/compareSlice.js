import { createSlice } from '@reduxjs/toolkit';

const MAX_COMPARE_ITEMS = 4;

const initialState = {
	selected: [], // array of minimal product summaries { id, name, image, specifications }
};

const compareSlice = createSlice({
	name: 'compare',
	initialState,
	reducers: {
		addToCompare: (state, action) => {
			const product = action.payload;
			if (!product || !product.id) return;
			const exists = state.selected.some(p => p.id === product.id);
			if (exists) return;
			if (state.selected.length >= MAX_COMPARE_ITEMS) {
				// Remove the oldest selection to keep size within limit
				state.selected.shift();
			}
			state.selected.push({
				id: product.id,
				name: product.name,
				image: product.images?.[0] || null,
				specifications: product.specifications || null
			});
		},
		removeFromCompare: (state, action) => {
			const id = action.payload;
			state.selected = state.selected.filter(p => p.id !== id);
		},
		clearCompare: (state) => {
			state.selected = [];
		},
		toggleCompare: (state, action) => {
			const product = action.payload;
			if (state.selected.some(p => p.id === product.id)) {
				state.selected = state.selected.filter(p => p.id !== product.id);
			} else {
				if (state.selected.length >= MAX_COMPARE_ITEMS) {
					state.selected.shift();
				}
				state.selected.push({
					id: product.id,
					name: product.name,
					image: product.images?.[0] || null,
					specifications: product.specifications || null
				});
			}
		}
	}
});

export const selectCompareItems = (state) => state.compare.selected;
export const { addToCompare, removeFromCompare, clearCompare, toggleCompare } = compareSlice.actions;
export default compareSlice.reducer;

