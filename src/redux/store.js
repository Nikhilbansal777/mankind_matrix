import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import inventoryReducer from './slices/inventorySlice';
import userReducer from './slices/userSlice';
import reviewReducer from './slices/reviewSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    inventory: inventoryReducer,
    user: userReducer,
    reviews: reviewReducer,
    recentlyViewed: recentlyViewedReducer,
    orders: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
