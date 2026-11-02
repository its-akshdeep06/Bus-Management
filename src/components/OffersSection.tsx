'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';
import { promoCodes } from '@/lib/data';

interface OffersSectionProps {
  onCopyCode: (code: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onCopyCode }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onCopyCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section style={{ margin: '3.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem' }}>Special Safar Offers & Deals</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Use these verified promo coupons during seat checkout for instant savings.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.2rem',
        }}
      >
        {promoCodes.map((offer) => {
          const isCopied = copiedCode === offer.code;

          return (
            <div
              key={offer.code}
              style={{
                background: 'var(--bg-surface)',
                border: '1.5px dashed var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.4rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '0 0 0 8px',
                }}
              >
                VERIFIED
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Tag size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    {offer.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', lineHeight: 1.4 }}>
                  {offer.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--warm-ivory)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <code
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    letterSpacing: '1px',
                    color: 'var(--primary)',
                  }}
                >
                  {offer.code}
                </code>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isCopied ? 'var(--success)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

