'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="print-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: '#fff',
        border: '1px solid var(--primary-dark)',
        color: 'var(--primary-dark)',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s ease',
      }}
    >
      <Printer size={18} /> 인쇄하기
    </button>
  );
}
