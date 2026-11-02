'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Send, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectRoute: (from: string, to: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRoute }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="safar-footer">
      <div className="footer-inner-grid">
        {/* Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <Image
              src="/assets/brand/safar-mark.svg"
              alt="Safar"
              width={38}
              height={38}
              style={{ borderRadius: 6 }}
            />
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
              Safar.
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 320, marginBottom: '1.2rem' }}>
            Redefining intercity bus mobility across India. Experience punctuality, verified hygiene, and seamless seat reservation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.82rem' }}>
            <ShieldCheck size={16} />
            <span>Govt. & Fleet Verified Bus Partners</span>
          </div>
        </div>

        {/* Popular Intercity Routes */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Top Travel Routes
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            {[
              ['Delhi', 'Jaipur'],
              ['Mumbai', 'Pune'],
              ['Bangalore', 'Chennai'],
              ['Bangalore', 'Goa'],
              ['Delhi', 'Manali'],
              ['Chandigarh', 'Shimla'],
            ].map(([from, to]) => (
              <li key={`${from}-${to}`}>
                <a
                  href="#search-widget"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectRoute(from, to);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {from} ➔ {to}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bus Fleets */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Fleet Categories
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <li>Volvo Multi-Axle AC</li>
            <li>BharatBenz AC Sleeper</li>
            <li>Scania Club Class</li>
            <li>Electric Express Intercity</li>
            <li>Non-AC Highway Deluxe</li>
          </ul>
        </div>

        {/* Newsletter & Updates */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-main)' }}>
            Travel Specials & Discounts
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
            Get secret seasonal promo codes and route announcements delivered to your inbox.
          </p>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.55rem 0.9rem' }}
              title="Subscribe"
            >
              <Send size={15} />
            </button>
          </form>
          {subscribed && (
            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700, marginTop: '0.4rem', display: 'block' }}>
              ✓ You are subscribed to Safar updates!
            </span>
          )}
        </div>
      </div>

      <div className="footer-bottom-strip">
        <div>
          &copy; {new Date().getFullYear()} <strong>Safar Express Mobility Inc.</strong> All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Travel</span>
          <span>Passenger Safety</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
};

