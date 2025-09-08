import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import inventoryReducer from './slices/inventorySlice';
import userReducer from './slices/userSlice';
import reviewReducer from './slices/reviewSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import compareReducer from './slices/compareSlice'; 
import orderReducer from './slices/orderSlice';
import couponReducer from './slices/couponSlice';
import addressReducer from './slices/addressSlice';


export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    inventory: inventoryReducer,
    user: userReducer,
    reviews: reviewReducer,
    recentlyViewed: recentlyViewedReducer,
    compare: compareReducer,
    order: orderReducer,
    coupons: couponReducer,
    addresses: addressReducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
