'use client';

import React from 'react';
import Image from 'next/image';
import { Ticket, User, LogOut, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentUser: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMyBookings: () => void;
  bookingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onOpenAuth,
  onLogout,
  onOpenMyBookings,
  bookingCount = 0,
}) => {
  return (
    <header className="safar-header">
      <div className="nav-container">
        <a href="#" className="brand-wrapper">
          <Image
            src="/assets/brand/safar-mark.svg"
            alt="Safar Logo"
            width={40}
            height={40}
            className="brand-logo-img"
          />
          <div>
            <div className="brand-title">
              Safar<span>.</span>
            </div>
            <div className="brand-tagline">Express Bus Travel</div>
          </div>
        </a>

        <div className="nav-actions">
          {/* Dark Mode Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* User Controls */}
          {currentUser ? (
            <>
              <button
                className="btn-ghost"
                onClick={onOpenMyBookings}
                title="View my trips"
              >
                <Ticket size={17} />
                <span>My Bookings</span>
                {bookingCount > 0 && (
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {bookingCount}
                  </span>
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  background: 'var(--warm-ivory)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}
              >
                <User size={16} color="var(--primary)" />
                <span>{currentUser}</span>
              </div>

              <button
                className="btn-outline"
                onClick={onLogout}
                title="Sign out"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth}>
              <User size={17} />
              <span>Sign in / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
