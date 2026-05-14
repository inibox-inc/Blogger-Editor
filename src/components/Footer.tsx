import React from 'react';

interface FooterProps {
  wordCount: number;
  charCount: number;
}

export const Footer: React.FC<FooterProps> = ({ wordCount, charCount }) => {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span>Palabras: {wordCount}</span>
        <span>Caracteres: {charCount}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></div>
        <span>BLOGGER READY</span>
      </div>
    </footer>
  );
};
