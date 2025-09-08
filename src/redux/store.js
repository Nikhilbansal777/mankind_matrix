import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import inventoryReducer from './slices/inventorySlice';
import userReducer from './slices/userSlice';
import reviewReducer from './slices/reviewSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import compareReducer from './slices/compareSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    inventory: inventoryReducer,
    user: userReducer,
    reviews: reviewReducer,
    recentlyViewed: recentlyViewedReducer,
    compare: compareReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
