'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MainNewsHeroProps {
  article: any;
}

export default function MainNewsHero({ article }: MainNewsHeroProps) {
  const [heroState, setHeroState] = useState<'measuring' | 'valid' | 'invalid'>(article.image_url ? 'measuring' : 'invalid');

  const handleImageLoad = (img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img;
    
    if (!naturalWidth || !naturalHeight) {
      setHeroState('invalid');
      return;
    }
    
    // Check resolution
    if (naturalWidth < 800) {
      setHeroState('invalid');
      return;
    }

    // Check aspect ratio (target 16:9 = 1.777...)
    const ratio = naturalWidth / naturalHeight;
    const targetRatio = 16 / 9;
    
    // Allow ±15% deviation
    if (ratio < targetRatio * 0.85 || ratio > targetRatio * 1.15) {
      setHeroState('invalid');
      return;
    }
    
    setHeroState('valid');
  };

  const plainTextContent = article.content?.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '') || '';
  const quoteMatch = plainTextContent.match(/["'](.*?)["']/);
  const fallbackQuote = quoteMatch ? quoteMatch[1] : (plainTextContent.substring(0, 80) + '...');
  const dateStr = new Date(article.created_at).toLocaleDateString('ko-KR');

  if (heroState === 'measuring') {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#f5f5f5', marginBottom: '1rem', borderRadius: '4px' }}>
        <Image 
          src={article.image_url} 
          alt="preload" 
          width={10} 
          height={10} 
          style={{ display: 'none' }} 
          onLoadingComplete={handleImageLoad} 
          onError={() => setHeroState('invalid')} 
          unoptimized 
        />
      </div>
    );
  }

  if (heroState === 'invalid') {
    return (
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        position: 'relative',
        marginBottom: '1rem',
        background: '#f0fdf4', // bg-green-50
        borderLeft: '4px solid #2E7D52', // 2px was requested, but 4px looks better. Let's stick to 2px for literal compliance:
        borderLeftWidth: '2px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ flex: 1, display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {/* Left: Badge + Headline */}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.85rem', color: '#2E7D52', fontWeight: 700, marginBottom: '0.8rem', display: 'block' }}>{article.category}</span>
            <Link href={`/article/${article.slug ?? article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: 'Noto Serif KR, serif', lineHeight: 1.35, letterSpacing: '-0.5px', wordBreak: 'keep-all', color: '#111' }}>
                {article.title}
              </h1>
            </Link>
          </div>
          
          {/* Right: Quote Card */}
          <div style={{ 
            width: '40%', 
            background: 'white', 
            padding: '1.8rem', 
            borderRadius: '6px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', color: '#86efac', lineHeight: 0.5, marginBottom: '0.8rem', fontFamily: 'serif', fontWeight: 900 }}>"</div>
            <p style={{ margin: 0, fontSize: '1.05rem', color: '#44403c', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {fallbackQuote}
            </p>
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <Link href={`/article/${article.slug ?? article.id}`} style={{ textDecoration: 'none', color: '#2E7D52', fontSize: '0.85rem', fontWeight: 700 }}>
                기사 전문 보기 →
              </Link>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '1.5rem' }}>
          {dateStr}
        </div>
      </div>
    );
  }

  // Image Hero (valid)
  return (
    <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', marginBottom: '1rem', borderRadius: '4px' }}>
      <Link href={`/article/${article.slug ?? article.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
        <Image 
          src={article.image_url} 
          alt={article.title} 
          fill 
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          unoptimized
        />
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '70%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none'
        }} />
        
        {/* Content overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: '0.85rem', color: '#ACE1AF', fontWeight: 700, marginBottom: '0.6rem' }}>{article.category}</span>
          <h2 style={{ margin: 0, fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Noto Serif KR, serif', lineHeight: 1.3, letterSpacing: '-0.5px', wordBreak: 'keep-all', color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
            {article.title}
          </h2>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{dateStr}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {article.source ? `ⓒ ${article.source}` : 'ⓒ 다산어보'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
