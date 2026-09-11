import React, { useEffect } from 'react';

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timeout = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div role="status" style={{ position: 'fixed', right: '1.5rem', bottom: '1.5rem', zIndex: 1100, maxWidth: 'min(360px, calc(100vw - 2rem))', padding: '0.85rem 1rem', backgroundColor: 'var(--bg-card)', border: '1px solid rgba(74, 222, 128, 0.45)', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
      {message}
    </div>
  );
}
