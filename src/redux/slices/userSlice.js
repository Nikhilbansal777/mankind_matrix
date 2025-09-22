import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api2/services/authService';
import userService from '../../api2/services/userService';

// Token management utilities
const getStoredToken = () => {
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem('refresh_token');
  } catch (error) {
    console.error('Error reading refresh token from localStorage:', error);
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    // Handle the case where "undefined" was stored as a string
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

const saveAuthData = (accessToken, refreshToken, user) => {
  try {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    // Only save user data if it's not null or undefined
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth data from localStorage:', error);
  }
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { access_token, refresh_token, user: authUser } = response;
      
      // If auth service returns user data directly, use it
      let user = authUser;
      
      // If no user data from auth service, try to get it from user service
      if (!user) {
        try {
          user = await userService.getCurrentUser();
        } catch (userError) {
          console.warn('User service not available, proceeding with login without user data:', userError.message);
          // Don't fail the login if user service is unavailable
        }
      }
      
      // Save auth data to localStorage
      saveAuthData(access_token, refresh_token, user);
      
      return { token: access_token, refreshToken: refresh_token, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authService.register(userData);
      
      // After registration, user needs to login to get tokens
      // For now, we'll just return the user data
      // In a real app, you might want to auto-login after registration
      
      return { user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      // Clear localStorage
      clearAuthData();
      return null;
    } catch (error) {
      // Even if API call fails, clear local data
      clearAuthData();
      return rejectWithValue(error.message);
    }
  }
);



export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const user = await userService.updateProfile(userData);
      
      // Update user in localStorage
      const currentToken = getStoredToken();
      const currentRefreshToken = getStoredRefreshToken();
      saveAuthData(currentToken, currentRefreshToken, user);
      
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      await userService.changePassword(passwordData);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin: fetch all users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ page = 0, size = 10, sort }, { rejectWithValue }) => {
    try {
      const params = { page, size };
      if (sort && sort.length > 0) params.sort = sort;
      const response = await userService.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Note: These methods are removed as they're not part of the user service anymore
// If you need admin functionality to fetch all users, you'll need to implement
// separate admin service or add these methods to the user service

const initialState = {
  // Authentication state
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false, // Add initialization flag
  
  // User management state
  currentUser: null,
  users: [],
  usersPagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10
  },
  
  // Loading states
  loading: {
    login: false,
    register: false,
    logout: false,
    currentUser: false,
    updateProfile: false,
    changePassword: false,
    fetchUsers: false
  },
  
  // Error state
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    // Manual logout (without API call)
    manualLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      clearAuthData();
    },
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();
      
      // Clean up corrupted localStorage data
      try {
        const userStr = localStorage.getItem('user');
        if (userStr === 'undefined' || userStr === 'null') {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error cleaning up localStorage:', error);
      }
      
      state.user = storedUser;
      state.token = storedToken;
      state.isAuthenticated = !!storedToken;
      state.isInitialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload;
      })
      
      // Handle registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.payload;
      })
      
      // Handle logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = action.payload;
      })
      

      
      // Handle getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.loading.currentUser = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading.currentUser = false;
        state.currentUser = action.payload;
        // Also update the main user state if it's null
        if (!state.user && action.payload) {
          state.user = action.payload;
          // Update localStorage with user data
          const currentToken = getStoredToken();
          const currentRefreshToken = getStoredRefreshToken();
          saveAuthData(currentToken, currentRefreshToken, action.payload);
        }
        // Set authenticated if we successfully got user data
        if (action.payload) {
          state.isAuthenticated = true;
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading.currentUser = false;
        state.error = action.payload;
      })
      
      // Handle updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.updateProfile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.user = action.payload;
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error = action.payload;
      })
      
      // Handle changePassword
      .addCase(changePassword.pending, (state) => {
        state.loading.changePassword = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.changePassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.changePassword = false;
        state.error = action.payload;
      })
      
      // Handle fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading.fetchUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.fetchUsers = false;
        // Support both paginated and non-paginated responses
        const payload = action.payload || {};
        if (Array.isArray(payload)) {
          state.users = payload;
          state.usersPagination = { ...state.usersPagination, totalItems: payload.length, totalPages: 1, currentPage: 0 };
        } else {
          state.users = payload.content || [];
          state.usersPagination = {
            currentPage: payload.number ?? 0,
            totalPages: payload.totalPages ?? 0,
            totalItems: payload.totalElements ?? (payload.content ? payload.content.length : 0),
            itemsPerPage: payload.size ?? state.usersPagination.itemsPerPage
          };
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.fetchUsers = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsInitialized = (state) => state.user.isInitialized;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUsers = (state) => state.user.users;
export const selectUsersPagination = (state) => state.user.usersPagination;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

// Specific loading selectors
export const selectLoginLoading = (state) => state.user.loading.login;
export const selectRegisterLoading = (state) => state.user.loading.register;
export const selectLogoutLoading = (state) => state.user.loading.logout;

export const selectCurrentUserLoading = (state) => state.user.loading.currentUser;
export const selectUpdateProfileLoading = (state) => state.user.loading.updateProfile;
export const selectChangePasswordLoading = (state) => state.user.loading.changePassword;
export const selectFetchUsersLoading = (state) => state.user.loading.fetchUsers;

export const { clearError, clearCurrentUser, manualLogout, initializeAuth } = userSlice.actions;
export default userSlice.reducer;
