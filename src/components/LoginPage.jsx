// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      onSignUp(username, password);
      // Redirect to "/home" after sign-up.
      navigate('/home');
    } else {
      onLogin(username, password);
      // Redirect to "/home" after login.
      navigate('/home');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.5rem',
    boxSizing: 'border-box' // ensures padding is included in the width calculation
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'var(--truist-purple)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    boxSizing: 'border-box' // optional, for consistency
  };

  return (
    <div
      className="login-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f2f2f2',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '300px',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>
          {isSignUp ? "Sign Up" : "Log In"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          {isSignUp && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          )}
          <button
            type="submit"
            style={buttonStyle}
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => setIsSignUp(false)}
              >
                Log In
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
