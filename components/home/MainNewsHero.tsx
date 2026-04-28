'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MainNewsHeroProps {
  article: any;
}

function extractFirstSentence(text: string): string {
  if (!text) return '';
  const plain = text.replace(/<[^>]*>/g, '').replace(/[#*`~]/g, '').trim();
  const dotIdx = plain.search(/[.。!?！？]/);
  if (dotIdx > 10 && dotIdx < 200) {
    return plain.slice(0, dotIdx + 1);
  }
  return plain.slice(0, 120) + '…';
}

export default function MainNewsHero({ article }: MainNewsHeroProps) {
  const imageUrl = article.image_url || '';
  // Start as 'invalid' if no image; 'measuring' otherwise
  const [heroState, setHeroState] = useState<'measuring' | 'valid' | 'invalid'>(
    imageUrl ? 'measuring' : 'invalid'
  );
  const measuredRef = useRef(false);

  useEffect(() => {
    if (!imageUrl) {
      setHeroState('invalid');
      return;
    }
    if (measuredRef.current) return;
    measuredRef.current = true;

    const img = new window.Image();
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      if (process.env.NODE_ENV === 'development') {
        const ratio = naturalWidth / naturalHeight;
        console.log('[MainNewsHero]', {
          imageUrl,
          naturalWidth,
          naturalHeight,
          ratio: ratio.toFixed(3),
          target: (16 / 9).toFixed(3),
          ratioOk: ratio >= (16 / 9) * 0.85 && ratio <= (16 / 9) * 1.15,
          resolutionOk: naturalWidth >= 800,
        });
      }
      if (!naturalWidth || !naturalHeight || naturalWidth < 800) {
        setHeroState('invalid');
        return;
      }
      const ratio = naturalWidth / naturalHeight;
      const targetRatio = 16 / 9;
      if (ratio < targetRatio * 0.85 || ratio > targetRatio * 1.15) {
        setHeroState('invalid');
        return;
      }
      setHeroState('valid');
    };
    img.onerror = () => setHeroState('invalid');
    // Use a cache-busted probe for accuracy if needed — but for speed, no bust
    img.src = imageUrl;
  }, [imageUrl]);

  const plainText = extractFirstSentence(article.content || article.subtitle || '');
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString('ko-KR')
    : '';
  const href = `/article/${article.slug ?? article.id}`;

  // ── MEASURING: skeleton while native img probes ──────────────────────────
  if (heroState === 'measuring') {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '400% 100%',
          animation: 'shimmer 1.4s infinite',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}
      >
        <style>{`@keyframes shimmer { 0%{background-position:100% 50%} 100%{background-position:-100% 50%} }`}</style>
      </div>
    );
  }

  // ── TEXT FALLBACK ─────────────────────────────────────────────────────────
  if (heroState === 'invalid') {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          minHeight: '260px',
          background: '#f0fdf4',
          borderLeft: '3px solid #2E7D52',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.2rem, 4%, 2.5rem)',
          boxSizing: 'border-box',
          marginBottom: '1rem',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 'clamp(1rem, 3%, 2.5rem)',
            alignItems: 'stretch',
          }}
        >
          {/* Left: Category + Headline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem' }}>
            <span
              style={{
                display: 'inline-block',
                background: '#dcfce7',
                color: '#1F6E3A',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.2rem 0.7rem',
                borderRadius: '2px',
                letterSpacing: '1px',
                alignSelf: 'flex-start',
              }}
            >
              {article.category || '종합'}
            </span>
            <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
                  fontWeight: 900,
                  fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
                  lineHeight: 1.35,
                  letterSpacing: '-0.5px',
                  wordBreak: 'keep-all',
                  color: '#111',
                }}
              >
                {article.title}
              </h2>
            </Link>
          </div>

          {/* Right: Pull-quote card */}
          {plainText && (
            <div
              style={{
                width: '42%',
                flexShrink: 0,
                background: 'white',
                padding: 'clamp(1rem, 3%, 1.8rem)',
                borderRadius: '6px',
                boxShadow: '0 4px 16px rgba(46,125,82,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.6rem',
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  color: '#86efac',
                  lineHeight: 0.6,
                  fontFamily: 'Georgia, serif',
                  fontWeight: 900,
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(0.82rem, 1.5vw, 1.05rem)',
                  color: '#44403c',
                  lineHeight: 1.7,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {plainText}
              </p>
              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <Link
                  href={href}
                  style={{
                    textDecoration: 'none',
                    color: '#2E7D52',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  기사 전문 보기 →
                </Link>
              </div>
            </div>
          )}
        </div>

        {dateStr && (
          <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '1rem' }}>
            {dateStr}
          </div>
        )}
      </div>
    );
  }

  // ── IMAGE HERO (valid) ────────────────────────────────────────────────────
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: '16/9',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '1rem',
        borderRadius: '4px',
        textDecoration: 'none',
      }}
    >
      <Image
        src={imageUrl}
        alt={article.title}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        unoptimized
      />
      {/* Bottom-to-top gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Content overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: '#dcfce7',
            color: '#1F6E3A',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '2px',
            marginBottom: '0.6rem',
          }}
        >
          {article.category || '종합'}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
            fontWeight: 900,
            fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
            wordBreak: 'keep-all',
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {article.title}
        </h2>
        <div
          style={{
            marginTop: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{dateStr}</span>
          <span style={{ fontSize: '0.68rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {article.source ? `ⓒ ${article.source}` : 'ⓒ 다산어보'}
          </span>
        </div>
      </div>
    </Link>
  );
}
