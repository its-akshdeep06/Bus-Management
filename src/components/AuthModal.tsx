'use client';

import React, { useState } from 'react';
import { User, Lock, Phone, X, LogIn, UserPlus } from 'lucide-react';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    if (!isLoginMode && password !== confirmPassword) {
      onError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLoginMode ? 'login' : 'register',
          username: username.trim(),
          password,
          name: fullName.trim(),
        }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        onSuccess(data.message);
        onLoginSuccess(data.username || username.trim());
        onClose();
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
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
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div
        className="safar-modal-card"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-trigger" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Tab Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--warm-ivory)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isLoginMode ? 'var(--bg-surface)' : 'transparent',
              color: isLoginMode ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: isLoginMode ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: !isLoginMode ? 'var(--bg-surface)' : 'transparent',
              color: !isLoginMode ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: !isLoginMode ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>
          {isLoginMode ? 'Welcome back to Safar' : 'Create your Safar Account'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
          {isLoginMode
            ? 'Sign in to access your bookings and express checkout.'
            : 'Join India’s premium bus network for easy booking and live alerts.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Phone Number or Username *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 9876543210 or traveluser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {!isLoginMode && (
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <span>Please wait...</span>
            ) : isLoginMode ? (
              <>
                <LogIn size={18} />
                <span>Sign In to Safar</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
