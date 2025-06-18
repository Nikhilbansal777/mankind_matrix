# Application Providers

This directory contains core application providers that wrap the entire application and provide essential context and functionality.

## 🏗️ Architecture Overview

The authentication system spans across multiple directories:

```
src/
├── providers/
│   ├── AuthProvider.jsx    # Authentication context provider
│   └── README.md          # This documentation
├── hooks/
│   └── useUser.js         # User management hook
├── redux/
│   ├── store.js           # Redux store configuration
│   └── slices/
│       └── userSlice.js   # User state management
├── api2/
│   ├── client.js          # API client with auth integration
│   ├── config.js          # API configuration
│   └── services/
│       └── userService.js # User API service
├── routes/
│   ├── AppRouter.jsx      # Main router with protected routes
│   └── ProtectedRoute.jsx # Route protection component
├── features/
│   ├── auth/
│   │   ├── login.jsx      # Login form
│   │   ├── signup.jsx     # Registration form
│   │   ├── LogoutButton.jsx # Logout button
│   │   └── loginForm.css  # Authentication styling

```

## 🔧 AuthProvider

Provides authentication context and handles token management across the entire application.

**Features:**
- Automatic token expiration checking
- Token refresh on page visibility change
- Current user validation on app mount
- Global authentication context

## 🚀 Integration

The `AuthProvider` is integrated at the application level in `src/App.js`:

```jsx
// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthProvider from './providers/AuthProvider';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <Provider store={store}> // Redux store provider
      <AuthProvider> // Authentication context provider
        <AppRouter /> // Application routes
      </AuthProvider>
    </Provider>
  );
};
```

## 🔐 Login Flow

The login process involves multiple layers working together:

### 1. User Interaction (UI Layer)
```jsx
// src/features/auth/login.jsx
const Login = () => {
  const { login, loading, error } = useUser();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username: 'user@example.com', password: 'password' });
      navigate('/'); // Redirect on success
    } catch (err) {
      // Error displayed automatically via error state
    }
  };
};
```

### 2. Hook Layer (useUser)
```jsx
// src/hooks/useUser.js
const login = useCallback(async (credentials) => {
  try {
    await dispatch(loginUser(credentials)).unwrap();
    return true;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}, [dispatch]);
```

### 3. Redux Action (userSlice)
```jsx
// src/redux/slices/userSlice.js
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
```

### 4. API Service Call
```jsx
// src/api2/services/userService.js
const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};
```

### 5. State Updates
```jsx
// Redux automatically updates state based on async thunk
const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
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
      });
  }
});
```

### 6. Automatic Token Management (AuthProvider)
```jsx
// src/providers/AuthProvider.jsx
const AuthProvider = ({ children }) => {
  const { token, isAuthenticated, refreshToken } = useUser();

  // Check token expiration every minute
  useEffect(() => {
    if (isAuthenticated && token) {
      const interval = setInterval(() => {
        checkTokenExpiration();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const checkTokenExpiration = () => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Refresh token 5 minutes before expiration
    if (payload.exp - currentTime < 300) {
      refreshToken();
    }
  };
};
```

### 7. Route Protection
```jsx
// src/routes/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  
  if (loading.currentUser) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

```jsx
// In AppRouter.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 📊 Login Flow Diagram

```
User fills login form
        ↓
   Form validation
        ↓
   Call useUser.login()
        ↓
   Dispatch loginUser thunk
        ↓
   API call to backend
        ↓
   Backend validates credentials
        ↓
   Backend returns tokens + user data
        ↓
   Save to localStorage
        ↓
   Update Redux state
        ↓
   AuthProvider starts token monitoring
        ↓
   User redirected to protected route
        ↓
   ProtectedRoute checks authentication
        ↓
   User sees authenticated content
```

## 🎣 Available Hooks

### useUser
Comprehensive user management hook (use this for all authentication needs).

```jsx
import useUser from '../hooks/useUser';

function MyComponent() {
  const { login, logout, isAuthenticated, user, loading, error } = useUser();
  
  // Component logic
}
```

## 🔐 Authentication System Components

### Core Providers
- `src/providers/AuthProvider.jsx` - Global authentication context

### Route Protection
- `src/routes/ProtectedRoute.jsx` - Route protection component
- `src/routes/AppRouter.jsx` - Main router with protected routes

### Authentication UI Components
- `src/features/auth/login.jsx` - Login form
- `src/features/auth/signup.jsx` - Registration form
- `src/features/auth/LogoutButton.jsx` - Logout button
- `src/features/auth/loginForm.css` - Authentication styling

### State Management (Redux)
- `src/redux/store.js` - Redux store configuration
- `src/redux/slices/userSlice.js` - User state management with async thunks

### Custom Hooks
- `src/hooks/useUser.js` - User management hook (main authentication hook)

### API Integration
- `src/api2/client.js` - API client with auth integration
- `src/api2/config.js` - API configuration
- `src/api2/services/userService.js` - User API service

### Profile Management
- `src/features/profile/AccountPage.jsx` - User account page
- `src/features/profile/Edit-Profile.jsx` - Profile editing
- `src/features/profile/Edit-Profile.css` - Profile styling
- `src/features/profile/ProfilePage.jsx` - Profile display
- `src/features/profile/ProfilePage.css` - Profile styling

### Layout Components
- `src/layouts/components/Header.jsx` - Header with auth status
- `src/layouts/components/Header.css` - Header styling
- `src/layouts/MainLayout.jsx` - Main layout wrapper
- `src/layouts/MainLayout.css` - Layout styling

## 🔒 Security Features

### Token Management
- **Automatic Refresh**: Tokens are refreshed 5 minutes before expiration
- **Session Validation**: User sessions are validated on app mount
- **Secure Storage**: Tokens stored in localStorage with error handling
- **Auto-Logout**: Automatic logout on token expiration or validation failure

### Route Protection
- **Authentication Required**: Protected routes redirect to login
- **Role-Based Access**: Admin routes require specific roles
- **Session Persistence**: Users stay logged in across page refreshes

### Error Handling
- **Graceful Degradation**: App continues to work even if auth fails
- **User Feedback**: Clear error messages for authentication issues
- **Automatic Recovery**: Token refresh attempts on authentication failures

## 🔧 Configuration

### Environment Variables
```bash
# Development
REACT_APP_DEV_USER_SERVICE_URL=http://localhost:8080/api

# Production
REACT_APP_PROD_USER_SERVICE_URL=https://your-api.com/api

# API Settings
REACT_APP_API_TIMEOUT=10000
REACT_APP_API_RETRY_ATTEMPTS=3
REACT_APP_API_RETRY_DELAY=1000
```

## 🚀 Getting Started

1. **Provider is already integrated** in `src/App.js`
2. **Routes are protected** in `src/routes/AppRouter.jsx`
3. **Use the useUser hook** in your components:

```jsx
import useUser from '../hooks/useUser';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    login, 
    logout, 
    updateProfile,
    loading,
    error 
  } = useUser();
  
  // All your authentication needs in one hook
}
```

## 🎯 Best Practices

1. **Use `useUser` hook** for all authentication needs
2. **Wrap protected routes** with `ProtectedRoute` component
3. **Handle loading states** in your components
4. **Provide user feedback** for authentication actions
