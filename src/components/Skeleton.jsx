import React from 'react';

export function Skeleton({ width = '100%', height = '1rem', style = {} }) {
  return <span aria-hidden="true" className="skeleton" style={{ width, height, display: 'block', borderRadius: 'var(--radius-sm)', ...style }} />;
}
