import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useUser from '../../hooks/useUser';
import './loginForm.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, isAuthenticated, clearError } = useUser();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username or email is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        username: formData.username,
        password: formData.password
      });
      
      // If login is successful, navigate to home or intended page
      navigate('/');
    } catch (err) {
      // Error is handled by the Redux slice and displayed via the error state
      console.error('Login failed:', err);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="icon">🔐</div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign in</h2>

            {location.state?.message && (
              <div className="form-success">
                {location.state.message}
              </div>
            )}

            <div className="form-group">
              <label>Username or Email</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading.login}
              />
              {validationErrors.username && (
                <div className="field-error">{validationErrors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading.login}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading.login}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {validationErrors.password && (
                <div className="field-error">{validationErrors.password}</div>
              )}
            </div>

            <div className="form-options">
              <label>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> 
                Remember me
              </label>
              <div className="forgot">
                <button 
                  type="button" 
                  className="link-button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading.login}
              className={loading.login ? 'loading' : ''}
            >
              {loading.login ? 'Signing in...' : 'Sign in →'}
            </button>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <p className="signup-link">
              No account?{' '}
              <button 
                type="button" 
                className="link-button"
                onClick={handleSignUp}
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
