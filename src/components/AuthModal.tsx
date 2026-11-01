'use client';

import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onError,
  onSuccess,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLoginMode ? 'login' : 'register',
          username,
          password,
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        onSuccess(data.message);
        if (isLoginMode) {
          onLoginSuccess(data.username || username);
          onClose();
          setUsername('');
          setPassword('');
        } else {
          setIsLoginMode(true);
        }
      } else {
        onError(data.message || 'Authentication failed');
      }
    } catch {
      onError('Network or server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLoginMode ? 'Sign in to Safar' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone Number / Username"
            required
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="toggle-auth">
          <span>
            {isLoginMode
              ? "Don't have an account?"
              : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
