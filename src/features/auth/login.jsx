import React, { useState } from 'react';
import './loginForm.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setEmailError('');
    setPasswordError('');
    setFormMessage('');
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    if (valid) {
      setFormMessage('Login successful!');
      if (onLogin) onLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="icon">🔐</div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign in</h2>

            {formMessage && <div className="form-success">{formMessage}</div>}

            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {submitted && emailError && <div className="field-error">{emailError}</div>}

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {submitted && passwordError && <div className="field-error">{passwordError}</div>}

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <div className="forgot">
                <button type="button" className="link-button">Forgot password?</button>
              </div>
            </div>

            <button type="submit">Sign in →</button>

            <p className="signup-link">
              No account? <button type="button" className="link-button">Sign up</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
