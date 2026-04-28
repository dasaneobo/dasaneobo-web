import Image from 'next/image';

interface BannerAdProps {
  slot: 'header-bottom' | 'article-top' | 'sidebar' | 'footer-top' | string;
  src?: string;
  href?: string;
  alt?: string;
  /** Mobile-specific image. Falls back to `src` if not provided. */
  mobileSrc?: string;
}

export default function BannerAd({ slot, src, href, alt, mobileSrc }: BannerAdProps) {
  if (!src || !href) return null;

  const AdContent = (
    <div
      className={`ad-container ad-slot-${slot}`}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#fafaf9',
        borderTop: '1px solid #e7e5e4',
        borderBottom: '1px solid #e7e5e4',
        padding: '8px 16px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* "광고" 라벨 — absolute 좌상단 */}
      <div
        style={{
          position: 'absolute',
          top: '7px',
          left: '8px',
          fontSize: '11px',
          color: '#78716c',
          fontWeight: 500,
          zIndex: 10,
          lineHeight: 1,
        }}
      >
        광고
      </div>

      {/* Desktop image */}
      <div
        className="ad-desktop-img"
        style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative', height: '90px' }}
      >
        {src && (
          <Image
            src={src}
            alt={alt || '광고'}
            fill
            style={{ objectFit: 'contain' }}
            priority={slot === 'header-bottom'}
          />
        )}
      </div>

      {/* Mobile image (shown only on narrow screens via CSS) */}
      <div
        className="ad-mobile-img"
        style={{ width: '100%', position: 'relative', height: '72px', display: 'none' }}
      >
        {(mobileSrc || src) && (
          <Image
            src={mobileSrc || src}
            alt={alt || '광고'}
            fill
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ad-desktop-img { display: none !important; }
          .ad-mobile-img  { display: block !important; }
          .ad-container { padding: 6px 16px 8px; }
        }
      `}</style>
    </div>
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored"
      style={{ display: 'block', width: '100%', textDecoration: 'none' }}
    >
      {AdContent}
    </a>
  );
}
