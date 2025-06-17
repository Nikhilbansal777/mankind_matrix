import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../api2/services/userService';

// Token management utilities
const getStoredToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error reading refresh token from localStorage:', error);
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

const saveAuthData = (token, refreshToken, user) => {
  try {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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
      const response = await userService.loginUser(credentials);
      const { token, refreshToken, user } = response;
      
      // Save to localStorage
      saveAuthData(token, refreshToken, user);
      
      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      const { token, refreshToken, user } = response;
      
      // Save to localStorage
      saveAuthData(token, refreshToken, user);
      
      return { token, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.logoutUser(userId);
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

export const refreshToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await userService.refreshToken(refreshToken);
      const { token } = response;
      
      // Update token in localStorage
      const currentUser = getStoredUser();
      const currentRefreshToken = getStoredRefreshToken();
      saveAuthData(token, currentRefreshToken, currentUser);
      
      return { token };
    } catch (error) {
      // If refresh fails, clear all auth data
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

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await userService.getUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const user = await userService.getUser(id);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Authentication state
  user: getStoredUser(),
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: !!getStoredToken(),
  
  // User management state
  users: [],
  currentUser: null,
  
  // Loading states
  loading: {
    login: false,
    register: false,
    logout: false,
    refresh: false,
    currentUser: false,
    updateProfile: false,
    changePassword: false,
    users: false,
    userById: false
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
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      clearAuthData();
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
        state.refreshToken = action.payload.refreshToken;
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
        state.refreshToken = action.payload.refreshToken;
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
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = action.payload;
      })
      
      // Handle refreshToken
      .addCase(refreshToken.pending, (state) => {
        state.loading.refresh = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading.refresh = false;
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading.refresh = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
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
        state.loading.users = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.payload;
      })
      
      // Handle fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading.userById = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading.userById = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading.userById = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUsers = (state) => state.user.users;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

// Specific loading selectors
export const selectLoginLoading = (state) => state.user.loading.login;
export const selectRegisterLoading = (state) => state.user.loading.register;
export const selectLogoutLoading = (state) => state.user.loading.logout;
export const selectRefreshLoading = (state) => state.user.loading.refresh;
export const selectCurrentUserLoading = (state) => state.user.loading.currentUser;
export const selectUpdateProfileLoading = (state) => state.user.loading.updateProfile;
export const selectChangePasswordLoading = (state) => state.user.loading.changePassword;
export const selectUsersLoading = (state) => state.user.loading.users;
export const selectUserByIdLoading = (state) => state.user.loading.userById;

export const { clearError, clearCurrentUser, manualLogout } = userSlice.actions;
export default userSlice.reducer;
