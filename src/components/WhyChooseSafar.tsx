'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Clock, Award, Headphones } from 'lucide-react';

const REASONS = [
  {
    icon: '/assets/illustrations/doodles/steering-wheel.svg',
    title: 'Certified Safety & Hygiene',
    desc: 'Every bus operator is verified and follows strict sanitisation and regular maintenance protocols.',
  },
  {
    icon: '/assets/illustrations/doodles/ticket.svg',
    title: 'Instant Confirmation & PNR',
    desc: 'Receive immediate ticket confirmation with live PNR, boarding coordinates, and digital ticket.',
  },
  {
    icon: '/assets/illustrations/doodles/compass.svg',
    title: 'Live Tracking & Updates',
    desc: 'Know exactly where your bus is with real-time GPS fleet updates and pickup reminders.',
  },
  {
    icon: '/assets/illustrations/doodles/sparkles.svg',
    title: '24/7 Dedicated Care',
    desc: 'Round-the-clock roadside and booking assistance for a peaceful, hassle-free journey.',
  },
];

export const WhyChooseSafar: React.FC = () => {
  return (
    <section style={{ margin: '4rem 0 3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>
          Why Millions Choose Safar for Intercity Travel
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Crafted to bring transparency, comfort, and reliability back into Indian road travel.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {REASONS.map((r, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.8rem 1.4rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--warm-ivory)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Image src={r.icon} alt={r.title} width={38} height={38} />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {r.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

