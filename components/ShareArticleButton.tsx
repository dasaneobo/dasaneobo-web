'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareArticleButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error sharing:', err);
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      alert('기사 링크가 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <button 
      onClick={handleShare}
      style={{ 
        background: 'none', 
        border: '1px solid #ddd', 
        padding: '0.4rem 1rem', 
        borderRadius: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        cursor: 'pointer',
        color: '#555',
        fontSize: '0.8rem',
        transition: 'all 0.2s'
      }}
      title="기사 공유하기"
    >
      <Share2 size={12} /> {copied ? '복사됨' : '공유'}
    </button>
  );
}
