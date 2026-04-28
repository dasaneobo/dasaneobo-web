import Image from 'next/image';

interface BannerAdProps {
  slot: "header-bottom" | "article-top" | "sidebar" | "footer-top" | string;
  src?: string;
  href?: string;
  alt?: string;
}

export default function BannerAd({ slot, src, href, alt }: BannerAdProps) {
  if (!src || !href) return null;

  const AdContent = (
    <div className={`ad-container ad-slot-${slot}`} style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#fafaf9',
      borderTop: '1px solid #e7e5e4',
      borderBottom: '1px solid #e7e5e4',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        fontSize: '11px',
        color: '#78716c',
        fontWeight: 500,
        zIndex: 10,
      }}>
        광고
      </div>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {src && (
          <div style={{ position: 'relative', width: '100%', height: '90px' }}>
            <Image 
              src={src} 
              alt={alt || "광고"} 
              fill
              style={{ objectFit: 'contain' }}
              priority={slot === 'header-bottom'}
            />
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener sponsored" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
      {AdContent}
    </a>
  ) : (
    <div style={{ width: '100%' }}>
      {AdContent}
    </div>
  );
}
