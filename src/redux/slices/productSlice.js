import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../api2/services/productService';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, size, sort }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({ page, size, sort: sort && sort.length > 0 ? sort : undefined });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, page, size, sort }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByCategory(categoryId, { page, size, sort: sort && sort.length > 0 ? sort : undefined });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getFeaturedProducts();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const product = await productService.getProduct(id);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const product = await productService.createProduct(data);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const product = await productService.updateProduct(id, data);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  featuredItems: [],
  currentProduct: null,
  loading: {
    products: false,
    featured: false,
    current: false,
    create: false,
    update: false,
    delete: false
  },
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.items = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements,
          itemsPerPage: action.payload.size
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.payload;
      })
      
      // Handle fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading.products = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading.products = false;
        state.items = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements,
          itemsPerPage: action.payload.size
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading.products = false;
        state.error = action.payload;
      })
      
      // Handle fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading.featured = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredItems = action.payload.content || action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading.featured = false;
        state.error = action.payload;
      })
      
      // Handle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading.current = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading.current = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading.current = false;
        state.error = action.payload;
      })
      
      // Handle createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      
      // Handle updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      
      // Handle deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.pagination.totalItems -= 1;
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectFeaturedProducts = (state) => state.products.featuredItems;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading.products;
export const selectFeaturedProductsLoading = (state) => state.products.loading.featured;
export const selectCurrentProductLoading = (state) => state.products.loading.current;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPagination = (state) => state.products.pagination;
export const selectCreateProductLoading = (state) => state.products.loading.create;
export const selectUpdateProductLoading = (state) => state.products.loading.update;
export const selectDeleteProductLoading = (state) => state.products.loading.delete;

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer; 