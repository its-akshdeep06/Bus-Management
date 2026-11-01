'use client';

import React from 'react';

interface HeaderProps {
  currentUser: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMyBookings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMyBookings,
}) => {
  return (
    <header className="header">
      <a href="#" className="logo">
        Safar.
      </a>
      <div className="nav-links">
        {currentUser && (
          <>
            <button
              id="my-bookings-btn"
              className="btn-outline"
              onClick={onOpenMyBookings}
              style={{ background: 'white' }}
            >
              My Bookings
            </button>
            <span className="user-greeting">Hi, {currentUser}</span>
          </>
        )}
        {currentUser ? (
          <button className="btn-outline" onClick={onLogout}>
            Log out
          </button>
        ) : (
          <button className="btn-primary" onClick={onOpenAuth}>
            Log in / Sign up
          </button>
        )}
      </div>
    </header>
  );
};

