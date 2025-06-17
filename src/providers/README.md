# Application Providers

This directory contains core application providers that wrap the entire application and provide essential context and functionality.

## 🏗️ Architecture Overview

```
src/providers/
├── AuthProvider.jsx    # Authentication context provider
└── README.md          # This documentation
```

## 🔧 Providers

### AuthProvider
Provides authentication context and handles token management across the entire application.

**Features:**
- Automatic token expiration checking
- Token refresh on page visibility change
- Current user validation on app mount
- Global authentication context

**Location:** `src/providers/AuthProvider.jsx`

## 🚀 Integration with App.js

The `AuthProvider` is integrated at the application level in `src/App.js`:

```jsx
// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthProvider from './providers/AuthProvider';
import './styles/global.css';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Provider>
  );
};

export default App;
```

### Provider Hierarchy:
```
<Provider store={store}>           // Redux store provider
  <AuthProvider>                   // Authentication context provider
    <AppRouter />                  // Application routes
  </AuthProvider>
</Provider>
```

## 🎣 Available Hooks

### useAuth
Access authentication context throughout the application.

```jsx
import { useAuth } from '../providers/AuthProvider';

function MyComponent() {
  const { isAuthenticated, user, token, loading } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.firstName}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### useUser
Comprehensive user management hook (recommended for most use cases).

```jsx
import useUser from '../hooks/useUser';

function MyComponent() {
  const { login, logout, isAuthenticated, user } = useUser();
  
  // Component logic
}
```

## 🔐 Authentication System Components

The authentication system is distributed across multiple directories:

### Core Providers
- `src/providers/AuthProvider.jsx` - Global authentication context

### Route Protection
- `src/routes/ProtectedRoute.jsx` - Route protection component
- `src/routes/AppRouter.jsx` - Main router with protected routes

### Authentication UI
- `src/features/auth/Login.jsx` - Login form
- `src/features/auth/Signup.jsx` - Registration form
- `src/features/auth/LogoutButton.jsx` - Logout button
- `src/features/auth/loginForm.css` - Authentication styling

### State Management
- `src/redux/slices/userSlice.js` - User state management
- `src/hooks/useUser.js` - User management hook

### API Integration
- `src/api2/services/userService.js` - User API service
- `src/api2/client.js` - API client with auth integration

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

## 📝 Usage Examples

### Basic Authentication Check
```jsx
import { useAuth } from '../providers/AuthProvider';

function Header() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user.firstName}</span>
          <LogoutButton />
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
}
```

### Protected Component
```jsx
import useUser from '../hooks/useUser';

function Dashboard() {
  const { user, logout } = useUser();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.firstName} {user.lastName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Route Protection
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

## 🔧 Configuration

### Environment Variables
Ensure these environment variables are set:

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

### Token Configuration
The AuthProvider automatically handles:
- Token expiration checking (every minute)
- Token refresh (5 minutes before expiration)
- Session validation (on app mount)
- Page visibility change handling

## 🚀 Getting Started

1. **Provider is already integrated** in `src/App.js`
2. **Routes are protected** in `src/routes/AppRouter.jsx`
3. **Use authentication hooks** in your components:

```jsx
// For general authentication
import useUser from '../hooks/useUser';

// For auth context (if needed)
import { useAuth } from '../providers/AuthProvider';
```

## 🎯 Best Practices

1. **Use `useUser` hook** for most authentication needs
2. **Use `useAuth` hook** only when you need the auth context specifically
3. **Wrap protected routes** with `ProtectedRoute` component
4. **Handle loading states** in your components
5. **Provide user feedback** for authentication actions

The authentication system is now properly organized with the `AuthProvider` at the application level, providing global authentication context and automatic token management! 